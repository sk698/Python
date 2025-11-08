// src/components/AddBusForm.jsx
import React, { useState } from 'react';
import api from '../api';

function AddBusForm({ onBusAdded }) {
    const [formData, setFormData] = useState({
        bus_name: '',
        source: '',
        destination: '',
        total_seats: '',
        fare_per_seat: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const submissionData = {
            ...formData,
            total_seats: parseInt(formData.total_seats),
            fare_per_seat: parseFloat(formData.fare_per_seat),
        };

        try {
            const response = await api.post('/admin/buses', submissionData);
            setSuccess(`Bus Added! New Bus ID: ${response.data.bus_id}`);
            setLoading(false);
            // Clear the form
            setFormData({
                bus_name: '',
                source: '',
                destination: '',
                total_seats: '',
                fare_per_seat: '',
            });
            // Refresh the main bus list
            if (onBusAdded) {
                onBusAdded();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message;
            setError(`Failed to add bus: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        // Re-using the same card style
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔧 Admin: Add New Bus</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label htmlFor="bus_name" className="block text-sm font-medium text-gray-700">Bus Name</label>
                    <input
                        type="text"
                        id="bus_name"
                        name="bus_name"
                        value={formData.bus_name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="total_seats" className="block text-sm font-medium text-gray-700">Total Seats</label>
                        <input
                            type="number"
                            id="total_seats"
                            name="total_seats"
                            value={formData.total_seats}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label htmlFor="fare_per_seat" className="block text-sm font-medium text-gray-700">Fare (₹)</label>
                        <input
                            type="number"
                            id="fare_per_seat"
                            name="fare_per_seat"
                            value={formData.fare_per_seat}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        // Admin-blue color from your tkinter app
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {loading ? 'Adding Bus...' : 'Add Bus'}
                    </button>
                </div>
            </form>

            {/* --- Messages --- */}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default AddBusForm;