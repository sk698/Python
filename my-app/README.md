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

---

## Prerequisites

* [Node.js](https://nodejs.org/) (LTS version recommended)
* The **Expo Go** app on your physical iOS or Android device  
  → [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)  
  → [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
* (Optional) Emulator setup  
  - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)  
  - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
* The **FastAPI backend** (from the `/backend` directory) **must be running** and accessible on your local network.

---

## ⚙️ Setup & Installation

You **must** configure the API connection before this app will work.

1. **Navigate to this directory:**
   ```bash
   cd my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Find your computer's local network IP:**
   * **Windows:** Run in CMD:
     ```bash
     ipconfig
     ```
     Look for the **IPv4 Address**.
   * **macOS/Linux:** Run in Terminal:
     ```bash
     ifconfig | grep inet
     ```
     Note the IP (e.g., `192.168.1.X`).

4. **Update the API Configuration:**
   * Rename `.env copy` to `.env`.
   * Open `.env` and replace the placeholder IP with your actual local IP.

   ```bash
   # my-app/.env
   EXPO_PUBLIC_API_IP="192.168.1.6"  # Change to your computer's IP
   EXPO_PUBLIC_API_PORT="8000"        # Port on which FastAPI runs
   ```

   ⚠️ Ensure your **phone/simulator and computer are on the same WiFi network**.

5. **Run the Expo development server:**
   ```bash
   npx expo start
   ```

6. **Launch the app:**
   - Open the **Expo Go** app on your phone.
   - Scan the **QR code** displayed in your terminal or browser.
   - The app will automatically load and connect to your backend API.

---

## 📲 Running the App on Your Phone

1. Ensure your **backend (FastAPI)** is running on your system:

2. Go to root directory and run this command
    ```bash
    cd backend
    ```
    ```bash
    uvicorn main:app --reload --host 0.0.0.0
    ```

3. Make sure your **Expo app** and **computer** are connected to the same WiFi.

4. Open the **Expo Go** app → Scan the **QR code** from your terminal.

5. The mobile app should now fetch bus data from your backend API and display it under the **Book** and **Admin** tabs.

---

## 🧰 Common Issues & Fixes

| Issue | Possible Fix |
|-------|---------------|
| App not connecting to backend | Ensure both devices are on same WiFi and `.env` IP is correct |
| Metro bundler stuck | Stop the process with `Ctrl + C` and run `npx expo start -c` |
| Network request failed | Check if FastAPI server (`uvicorn`) is running and firewall allows access |

---

## 🧑‍💻 Tech Stack

* **Frontend Framework:** React Native (Expo)
* **Language:** TypeScript
* **Navigation:** Expo Router
* **State Management:** React Context
* **API Calls:** Axios
* **Backend:** FastAPI (Python)
* **Database:** MySQL

---
