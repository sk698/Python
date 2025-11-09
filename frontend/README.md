# 🖥️ Frontend: Bus Booking Web App (React + Vite)

This is the React-based web interface for the Bus Ticket Booking System. It's built with **Vite** and styled with **Tailwind CSS**.

## Features

* **View Buses:** See a real-time list of all available buses from the API.
* **Book Ticket:** A dedicated form to book a new ticket.
* **Cancel Ticket:** A form to cancel an existing booking by its ID.
* **Admin: Add Bus:** An admin form to add a new bus route to the system.
* **Admin: Remove Bus:** A button on the bus list to remove a bus route.

## Prerequisites

* [Node.js](https://nodejs.org/) (LTS version recommended).
* The **FastAPI backend** (from the `/backend` directory) **must be running** on `http://127.0.0.1:8000`.

## Setup & Installation

1.  **Navigate to this directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## API Connection

This application is configured in `src/api.js` to connect to the backend at `http://127.0.0.1:8000`. If your backend is running on a different port, you must update this file.