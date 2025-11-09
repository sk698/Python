import React from 'react';
import { FlatList, View } from 'react-native'; // 1. Import FlatList and View
import BookingForm from '../../src/components/BookingForm';
import CancelBooking from '../../src/components/CancelBooking';
import BusList from '../../src/components/BusList';
import { styles } from '../../src/styles';

// 2. Define your screen's components as data
const screenComponents = [
    { key: 'booking', component: <BookingForm /> },
    { key: 'cancel', component: <CancelBooking /> },
    { key: 'buslist', component: <BusList showRemoveButton={false} /> },
];

export default function BookScreen() {
    return (
        // 3. Use a FlatList as the main screen component
        <FlatList
            style={styles.screen}
            data={screenComponents}
            renderItem={({ item }) => item.component}
            keyExtractor={(item) => item.key}
            // Adds a little space at the bottom
            ListFooterComponent={<View style={{ height: 16 }} />} 
        />
    );
}