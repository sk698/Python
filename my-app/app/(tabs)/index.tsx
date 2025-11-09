import React from 'react';
import { ScrollView } from 'react-native';
import BookingForm from '../../src/components/BookingForm';
import CancelBooking from '../../src/components/CancelBooking';
import BusList from '../../src/components/BusList';
import { styles } from '../../src/styles';

export default function BookScreen() {
    return (
        <ScrollView style={styles.screen}>
            <BookingForm />
            <CancelBooking />
            {/* This is the "Book" tab, so we pass `showRemoveButton={false}` 
        to hide the admin's "Remove" button.
      */}
            <BusList showRemoveButton={false} />
        </ScrollView>
    );
}