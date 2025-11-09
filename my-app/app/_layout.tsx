import React from 'react';
import { Stack } from 'expo-router';
import { BusProvider } from '../src/BusContext';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    // Wrap the entire app in the BusProvider so all screens
    // can access the shared bus data.
    <BusProvider>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="(tabs)" // This tells Expo Router to look for the (tabs) layout
          options={{ headerShown: false }} // Hides the top-level header
        />
      </Stack>
    </BusProvider>
  );
}