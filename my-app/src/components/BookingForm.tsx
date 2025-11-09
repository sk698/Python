import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // 1. Import the new component
import { useBus } from '../BusContext';
import api from '../api';
import { styles } from '../styles';

export default function BookingForm() {
    const { fetchBuses } = useBus(); // Get the refresh function
    const [formData, setFormData] = useState({
        passenger_name: '',
        age: '',
        gender: 'M',
        bus_id: '',
        seats_to_book: '1',
        travel_date: '', // This will still hold our "YYYY-MM-DD" string
    });
    const [loading, setLoading] = useState(false);

    // --- 2. Add new state for the date picker ---
    const [pickerDate, setPickerDate] = useState(new Date()); // Holds the Date object
    const [showPicker, setShowPicker] = useState(false);      // Toggles the picker modal

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- 3. Add a handler for when the date is selected ---
    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // Always close the picker
        setShowPicker(false);

        if (selectedDate) {
            // Update the Date object for the picker
            setPickerDate(selectedDate);

            // Format the date to "YYYY-MM-DD" for our form data and API
            const formattedDate = selectedDate.toISOString().split('T')[0];

            // Update the form data
            handleChange('travel_date', formattedDate);
        }
    };

    // --- 4. Add a function to show the picker ---
    const showDatepicker = () => {
        setShowPicker(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        // ... (rest of the handleSubmit function is identical)
        const { passenger_name, age, bus_id, seats_to_book, travel_date } = formData;
        if (!passenger_name || !age || !bus_id || !seats_to_book || !travel_date) {
            Alert.alert("Error", "Please fill all fields.");
            setLoading(false);
            return;
        }

        try {
            const submissionData = {
                ...formData,
                age: parseInt(age),
                bus_id: parseInt(bus_id),
                seats_to_book: parseInt(seats_to_book),
            };
            const response = await api.post('/bookings', submissionData);
            Alert.alert(
                "Success",
                `Booking Confirmed! ID: ${response.data.booking_id}\nTotal Fare: ₹${response.data.total_fare}`
            );
            // Reset form and refresh bus list
            setFormData({ passenger_name: '', age: '', gender: 'M', bus_id: '', seats_to_book: '1', travel_date: '' });
            setPickerDate(new Date()); // Also reset the picker date
            fetchBuses();
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message;
            Alert.alert("Booking Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Book Your Ticket</Text>

            <TextInput
                style={styles.input}
                placeholder="Passenger Name"
                value={formData.passenger_name}
                onChangeText={(val) => handleChange('passenger_name', val)}
            />

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="Age"
                    value={formData.age}
                    onChangeText={(val) => handleChange('age', val)}
                    keyboardType="numeric"
                />
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 8 }]}>
                    <Picker
                        selectedValue={formData.gender}
                        onValueChange={(val) => handleChange('gender', val)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Male" value="M" />
                        <Picker.Item label="Female" value="F" />
                        <Picker.Item label="Other" value="O" />
                    </Picker>
                </View>
            </View>

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="Bus ID"
                    value={formData.bus_id}
                    onChangeText={(val) => handleChange('bus_id', val)}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="Seats"
                    value={formData.seats_to_book}
                    onChangeText={(val) => handleChange('seats_to_book', val)}
                    keyboardType="numeric"
                />
            </View>

            {/* --- 5. Replace the Travel Date TextInput with this button --- */}
            <TouchableOpacity onPress={showDatepicker} style={styles.input}>
                <Text style={{ color: formData.travel_date ? '#000' : '#999' }}>
                    {formData.travel_date || "Select Travel Date"}
                </Text>
            </TouchableOpacity>

            {/* --- 6. Conditionally render the DateTimePicker modal --- */}
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={pickerDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4CAF50' }]} // Green
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}