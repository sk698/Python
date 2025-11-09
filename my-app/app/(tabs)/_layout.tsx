import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native'; // 1. Import the Image component

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                // Your existing header title
                headerTitle: '🚌 Bus Ticket Booking',
                headerTitleStyle: {
                    color: '#1E88E5', 
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#1E88E5', 

                // 2. Add this 'headerLeft' prop
                headerLeft: () => (
                    <Image
                        source={require('../../assets/icon.png')} // 3. Point this to your logo
                        style={{ 
                            width: 30, 
                            height: 30, 
                            marginLeft: 16, // Add some spacing
                            resizeMode: 'contain'
                        }}
                    />
                ),
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