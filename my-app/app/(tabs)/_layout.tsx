import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Expo comes with these icons

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                // Set a nice header title for both tabs
                headerTitle: '🚌 Bus Ticket Booking',
                headerTitleStyle: {
                    color: '#1E88E5', // Blue from your app
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#1E88E5', // Active tab color
            }}
        >
            <Tabs.Screen
                name="index" // This maps to app/(tabs)/index.tsx
                options={{
                    title: 'Book',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bus-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="admin" // This maps to app/(tabs)/admin.tsx
                options={{
                    title: 'Admin',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="build-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}