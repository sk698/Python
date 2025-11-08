// src/components/BusList.jsx
import React, { useState } from 'react';
import api from '../api'; // We need api for the delete request

// The component still receives its main data as props
function BusList({ buses, loading, error, onRefresh }) {
    // We'll add a local loading state for the remove button
    const [removingId, setRemovingId] = useState(null);

    const handleRemove = async (busId) => {
        // Confirm before deleting
        if (!window.confirm(`Are you sure you want to remove Bus ID: ${busId}? This cannot be undone.`)) {
            return;
        }

        setRemovingId(busId); // Set loading state for this specific button
        try {
            await api.delete(`/admin/buses/${busId}`);
            // Success! Refresh the entire list
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message;
            // Use an alert for errors during removal for simplicity
            alert(`Failed to remove bus: ${errorMessage}`);
        } finally {
            setRemovingId(null); // Clear loading state
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading available buses...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">Error fetching buses: {error}</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Available Buses</h2>
                <button
                    onClick={onRefresh}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={removingId} // Disable refresh while removing
                >
                    Refresh
                </button>
            </div>

            <div className="shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left font-semibold">Bus ID</th>
                            <th className="py-3 px-6 text-left font-semibold">Bus Name</th>
                            <th className="py-3 px-6 text-left font-semibold">Source</th>
                            <th className="py-3 px-6 text-left font-semibold">Destination</th>
                            <th className="py-3 px-6 text-left font-semibold">Seats</th>
                            <th className="py-3 px-6 text-left font-semibold">Fare</th>
                            <th className="py-3 px-6 text-left font-semibold">Admin</th> {/* 1. Add Admin Header */}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {buses.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-4 px-6 text-center text-gray-500">No buses available.</td>
                            </tr>
                        ) : (
                            buses.map((bus) => (
                                <tr key={bus.bus_id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6">{bus.bus_id}</td>
                                    <td className="py-3 px-6">{bus.bus_name}</td>
                                    <td className="py-3 px-6">{bus.source}</td>
                                    <td className="py-3 px-6">{bus.destination}</td>
                                    <td className="py-3 px-6 font-medium">{bus.available_seats}</td>
                                    <td className="py-3 px-6">₹{bus.fare_per_seat}</td>
                                    {/* 2. Add Remove Button Cell */}
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => handleRemove(bus.bus_id)}
                                            disabled={removingId === bus.bus_id} // Disable only this button
                                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400"
                                        >
                                            {removingId === bus.bus_id ? '...' : 'Remove'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BusList;