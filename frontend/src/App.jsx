// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import BusList from './components/BusList';
import BookingForm from './components/BookingForm';
import CancelBooking from './components/CancelBooking';
import AddBusForm from './components/AddBusForm'; // 1. Import the new admin form

function App() {
  const [buses, setBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [busError, setBusError] = useState(null);

  const fetchBuses = useCallback(async () => {
    setLoadingBuses(true);
    try {
      const response = await api.get('/buses');
      setBuses(response.data);
      setBusError(null);
    } catch (err) {
      setBusError(err.message);
      setBuses([]);
    } finally {
      setLoadingBuses(false);
    }
  }, []);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return (
    <div className="App min-h-screen text-gray-900 bg-gray-50">
      <header className="bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-blue-700 p-6 text-center">
          🚌 Bus Ticket Booking System
        </h1>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Forms */}
          {/* The space-y-8 class adds nice spacing between our form cards */}
          <div className="lg:col-span-1 space-y-8">
            <BookingForm 
              onBookingSuccess={fetchBuses} 
            />
            <CancelBooking
              onCancelSuccess={fetchBuses}
            />
            {/* 2. Add the new admin form component here */}
            <AddBusForm
              onBusAdded={fetchBuses}
            />
          </div>

          {/* Column 2: Bus List */}
          <div className="lg:col-span-2">
            <BusList 
              buses={buses}
              loading={loadingBuses}
              error={busError}
              onRefresh={fetchBuses}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;