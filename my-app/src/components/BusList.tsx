import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useBus } from '../BusContext';
import api from '../api';
import { styles } from '../styles';

// We add a prop to control whether the "Remove" button is shown
interface BusListProps {
    showRemoveButton?: boolean;
}

export default function BusList({ showRemoveButton = false }: BusListProps) {
    // Get all the bus data and functions from our shared context
    const { buses, loading, error, fetchBuses } = useBus();
    const [removingId, setRemovingId] = useState<number | null>(null);

    // Fetch buses when the component first loads
    useEffect(() => {
        fetchBuses();
    }, [fetchBuses]); // Re-run if fetchBuses changes (it won't, but it's good practice)

    const handleRemove = (busId: number) => {
        Alert.alert(
            "Confirm Remove",
            `Are you sure you want to remove Bus ID: ${busId}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: async () => {
                        setRemovingId(busId);
                        try {
                            await api.delete(`/admin/buses/${busId}`);
                            fetchBuses(); // Refresh the list
                        } catch (err: any) {
                            const msg = err.response?.data?.detail || err.message;
                            Alert.alert("Error", `Failed to remove bus: ${msg}`);
                        } finally {
                            setRemovingId(null);
                        }
                    }
                }
            ]
        );
    };

    // How to render a single item in the list
    const renderBusItem = ({ item }: { item: (typeof buses)[0] }) => (
        <View style={styles.busItem}>
            <View style={styles.busRow}>
                <Text style={styles.busName}>(ID: {item.bus_id}) {item.bus_name}</Text>
                <Text style={styles.busFare}>₹{item.fare_per_seat}</Text>
            </View>
            <View style={styles.busRow}>
                <Text style={styles.busRoute}>{item.source} to {item.destination}</Text>
                <Text style={styles.busSeats}>Seats: {item.available_seats}</Text>
            </View>
            {/* Only show the remove button if prop is true */}
            {showRemoveButton && (
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(item.bus_id)}
                    disabled={removingId === item.bus_id}
                >
                    <Text style={styles.buttonTextSmall}>
                        {removingId === item.bus_id ? "..." : "Remove"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    // --- Render logic ---
    if (loading && buses.length === 0) {
        return <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 20 }} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error fetching buses: {error}</Text>;
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Available Buses</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchBuses} disabled={loading}>
                    <Text style={styles.buttonTextSmall}>Refresh</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={buses}
                renderItem={renderBusItem}
                keyExtractor={(item) => item.bus_id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>No buses available.</Text>}
                refreshing={loading}
                onRefresh={fetchBuses} // Enables pull-to-refresh
            />
        </View>
    );
}