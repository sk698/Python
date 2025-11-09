import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useBus } from '../BusContext';
import api from '../api';
import { styles } from '../styles';

export default function AddBusForm() {
    const { fetchBuses } = useBus(); // Get the refresh function
    const [formData, setFormData] = useState({
        bus_name: '', source: '', destination: '',
        total_seats: '', fare_per_seat: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const { bus_name, source, destination, total_seats, fare_per_seat } = formData;
        if (!bus_name || !source || !destination || !total_seats || !fare_per_seat) {
            Alert.alert("Error", "Please fill all fields.");
            setLoading(false);
            return;
        }

        try {
            const submissionData = {
                ...formData,
                total_seats: parseInt(total_seats),
                fare_per_seat: parseFloat(fare_per_seat),
            };
            const response = await api.post('/admin/buses', submissionData);
            Alert.alert("Success", `Bus Added! ID: ${response.data.bus_id}`);
            // Reset form and refresh list
            setFormData({ bus_name: '', source: '', destination: '', total_seats: '', fare_per_seat: '' });
            fetchBuses();
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message;
            Alert.alert("Failed to Add Bus", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin: Add New Bus</Text>
            <TextInput style={styles.input} placeholder="Bus Name" value={formData.bus_name} onChangeText={(v) => handleChange('bus_name', v)} />
            <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Source" value={formData.source} onChangeText={(v) => handleChange('source', v)} />
                <TextInput style={[styles.input, { flex: 1, marginLeft: 8 }]} placeholder="Destination" value={formData.destination} onChangeText={(v) => handleChange('destination', v)} />
            </View>
            <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Total Seats" value={formData.total_seats} onChangeText={(v) => handleChange('total_seats', v)} keyboardType="numeric" />
                <TextInput style={[styles.input, { flex: 1, marginLeft: 8 }]} placeholder="Fare (₹)" value={formData.fare_per_seat} onChangeText={(v) => handleChange('fare_per_seat', v)} keyboardType="numeric" />
            </View>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#1E88E5' }]} // Blue
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Adding...' : 'Add Bus'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}