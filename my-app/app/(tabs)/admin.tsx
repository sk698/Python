import React from 'react';
import { ScrollView } from 'react-native';
import AddBusForm from '../../src/components/AddBusForm';
import BusList from '../../src/components/BusList';
import { styles } from '../../src/styles';

export default function AdminScreen() {
    return (
        <ScrollView style={styles.screen}>
            <AddBusForm />
            {/* This is the "Admin" tab, so we pass `showRemoveButton={true}` 
        to show the "Remove" button on each bus.
      */}
            <BusList showRemoveButton={true} />
        </ScrollView>
    );
}