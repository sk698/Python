// src/components/CancelBooking.jsx
import React, { useState } from 'react';
import api from '../api';

function CancelBooking({ onCancelSuccess }) {
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bookingId) {
            setError('Please enter a Booking ID.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Make the DELETE request to the /bookings/{booking_id} endpoint
            const response = await api.delete(`/bookings/${bookingId}`);

            setSuccess(response.data.message || 'Booking cancelled successfully!');
            setLoading(false);
            setBookingId(''); // Clear the input

            // Tell the parent component (App.jsx) to refresh the bus list
            if (onCancelSuccess) {
                onCancelSuccess();
            }

        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message;
            setError(`Cancellation Failed: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        // We use the same card styling as the BookingForm
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cancel a Ticket</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="booking_id" className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <input
                        type="number"
                        id="booking_id"
                        name="booking_id"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your booking ID"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        // Styled with a red color, matching your tkinter app's intent
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
                    >
                        {loading ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                </div>
            </form>

            {/* --- Messages --- */}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default CancelBooking;