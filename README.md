# 🚌 Bus Ticket Booking System

This project is a comprehensive Bus Ticket Booking System built with a modern, decoupled architecture. It includes a Python/FastAPI backend, a React web frontend, and a React Native mobile application.

The project also contains an original version of the application built as a standalone desktop GUI using Python's **Tkinter** library (`main.py`).

## Project Structure

## Core Technologies

* **Backend:** Python, FastAPI, MySQL (`mysql-connector-python`)
* **Web Frontend:** React, Vite, Tailwind CSS, Axios
* **Mobile Frontend:** React Native, Expo (with Expo Router), TypeScript, Axios
* **Database:** MySQL
* **Original App:** Python, Tkinter

## High-Level Setup Guide

To run the full system (backend + frontend + mobile), follow these steps in order.

### 1. Database Setup

1.  Ensure you have a **MySQL** server running.
2.  Log in to your MySQL server (e.g., as `root`).
3.  Create and populate the database using the provided schema:
    ```sql
    -- Create the database
    CREATE DATABASE bus_db;
    USE bus_db;

    -- Run all commands from backend/database/model.sql
    -- (CREATE TABLE Buses, Passengers, Bookings...)
    -- (INSERT into Buses, BusSchedule...)
    ```
4.  Update the database credentials in `backend/main.py` if they differ from the defaults (user: `root`, password: `12345678`).

### 2. Backend (FastAPI)

1.  Navigate to the project root directory.
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
4.  Run the API server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0
    ```
5.  The API will be live at `http://127.0.0.1:8000/docs`.

### 3. Frontend / Mobile

Once the backend is running, you can run either the web frontend or the mobile app (or both).

---

## Project Components (Navigation)

For detailed setup instructions for each frontend, please see their respective README files:

* ### [**`frontend/` (Web App)**](./frontend/README.md)
    * A React + Vite web application for booking and admin tasks from a browser.

* ### [**`my-app/` (Mobile App)**](./my-app/README.md)
    * A React Native + Expo mobile app for iOS and Android.