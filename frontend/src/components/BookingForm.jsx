// src/components/BookingForm.jsx
import React, { useState } from 'react';
import api from '../api';

function BookingForm({ onBookingSuccess }) {
    // State for all form fields
    const [formData, setFormData] = useState({
        passenger_name: '',
        age: '',
        gender: 'M', // Default value
        bus_id: '',
        seats_to_book: '1', // Default value
        travel_date: '',
    });

    // State for loading and API messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Generic handler to update state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Convert numeric fields from strings to numbers
        const submissionData = {
            ...formData,
            age: parseInt(formData.age),
            bus_id: parseInt(formData.bus_id),
            seats_to_book: parseInt(formData.seats_to_book),
        };

        try {
            const response = await api.post('/bookings', submissionData);
            setSuccess(`Booking Confirmed! Your Booking ID is: ${response.data.booking_id}. Total Fare: ₹${response.data.total_fare}`);
            setLoading(false);
            // Clear the form on success
            setFormData({
                passenger_name: '',
                age: '',
                gender: 'M',
                bus_id: '',
                seats_to_book: '1',
                travel_date: '',
            });
            // Tell the parent component to refresh the bus list
            if (onBookingSuccess) {
                onBookingSuccess();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message;
            setError(`Booking Failed: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Ticket</h2>

            {/* --- Form --- */}
            <form onSubmit={handleSubmit}>

                {/* Passenger Name */}
                <div className="mb-4">
                    <label htmlFor="passenger_name" className="block text-sm font-medium text-gray-700">Passenger Name</label>
                    <input
                        type="text"
                        id="passenger_name"
                        name="passenger_name"
                        value={formData.passenger_name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Age & Gender (side-by-side) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                </div>

                {/* Bus ID & Seats (side-by-side) */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="bus_id" className="block text-sm font-medium text-gray-700">Bus ID</label>
                        <input
                            type="number"
                            id="bus_id"
                            name="bus_id"
                            value={formData.bus_id}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label htmlFor="seats_to_book" className="block text-sm font-medium text-gray-700">Seats</label>
                        <input
                            type="number"
                            id="seats_to_book"
                            name="seats_to_book"
                            value={formData.seats_to_book}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                        />
                    </div>
                </div>

                {/* Travel Date */}
                <div className="mb-6">
                    <label htmlFor="travel_date" className="block text-sm font-medium text-gray-700">Travel Date</label>
                    <input
                        type="date"
                        id="travel_date"
                        name="travel_date"
                        value={formData.travel_date}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </form>

            {/* --- Messages --- */}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default BookingForm;