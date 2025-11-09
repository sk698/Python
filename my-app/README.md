# 📱 Mobile App: Bus Booking (React Native + Expo)

This is the React Native (Expo) mobile application for the Bus Ticket Booking System. It's written in **TypeScript** and uses **Expo Router** for navigation and **React Context** for global state management.

## Features

* **Tabbed Navigation:** Simple two-tab layout for "Book" and "Admin".
* **Global State:** Uses React Context (`src/BusContext.tsx`) to share bus data and loading states across all components.
* **Book Tab:**
    * View all available buses.
    * Book a new ticket using a native form (with date picker).
    * Cancel an existing ticket by its ID.
* **Admin Tab:**
    * Add a new bus route.
    * View all buses with a "Remove" button on each.

## Prerequisites

* [Node.js](https://nodejs.org/) (LTS version recommended).
* The **Expo Go** app on your physical iOS or Android device.
    * (Alternatively) An [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) or [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).
* The **FastAPI backend** (from the `/backend` directory) **must be running** and accessible on your local network.

## ⚠️ CRITICAL: Setup & Installation

You **must** configure the API connection before this app will work.

1.  **Navigate to this directory:**
    ```bash
    cd my-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Find your Computer's Network IP:**
    * **Windows:** Open `cmd` and type `ipconfig` (Look for `IPv4 Address`).
    * **macOS/Linux:** Open `Terminal` and type `ifconfig | grep inet` (Look for the `inet` address, e.g., `192.168.1.X`).

4.  **Update the API Configuration:**
    * Open the file `my-app/src/api.ts`.
    * Change the `API_IP` constant from its placeholder to your computer's actual network IP address.

    ```typescript
    // my-app/src/api.ts

    // ...
    //
    // Your phone/simulator must be on the same WiFi network as your computer.
    //
    const API_IP = '192.168.1.6'; // <-- CHANGE THIS to your computer's IP
    const API_PORT = '8000'; // Your FastAPI port
    const API_BASE_URL = `http://${API_IP}:${API_PORT}`;
    // ...
    ```

5.  **Run the app:**
    ```bash
    npx expo start
    ```

6.  Scan the QR code shown in the terminal using the **Expo Go** app on your phone.