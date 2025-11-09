import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useBus } from '../BusContext';
import api from '../api';
import { styles } from '../styles';

export default function CancelBooking() {
    const { fetchBuses } = useBus(); // Get the refresh function
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!bookingId) {
            Alert.alert("Error", "Please enter a Booking ID.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.delete(`/bookings/${bookingId}`);
            Alert.alert("Success", response.data.message || 'Booking cancelled!');
            setBookingId(''); // Clear input
            fetchBuses(); // Refresh bus list
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message;
            Alert.alert("Cancellation Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Cancel a Ticket</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your Booking ID"
                value={bookingId}
                onChangeText={setBookingId}
                keyboardType="numeric"
            />
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#E53935' }]} // Red
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Cancelling...' : 'Cancel Booking'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}