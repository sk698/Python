import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from './api'

// Define the shape (TypeScript interface) of a Bus
interface Bus {
    bus_id: number;
    bus_name: string;
    source: string;
    destination: string;
    available_seats: number;
    fare_per_seat: number;
}

// Define the shape of the data our context will provide
interface BusContextType {
    buses: Bus[];
    loading: boolean;
    error: string | null;
    fetchBuses: () => void; // A function to refresh the bus list
}

// Create the context
const BusContext = createContext<BusContextType | undefined>(undefined);

// Create the "Provider" component.
// This component will wrap our whole app and "provide" the bus data.
export const BusProvider = ({ children }: { children: ReactNode }) => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This function fetches the buses from our API
    // useCallback is a performance optimization
    const fetchBuses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/buses');
            setBuses(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setBuses([]); // Clear old data on error
        } finally {
            setLoading(false);
        }
    }, []);

    // Provide the bus data and the fetch function to all children
    return (
        <BusContext.Provider value={{ buses, loading, error, fetchBuses }}>
            {children}
        </BusContext.Provider>
    );
};

// Create a custom "hook"
// This is a simple shortcut so our components can easily access the bus data
export const useBus = () => {
    const context = useContext(BusContext);
    if (context === undefined) {
        throw new Error('useBus must be used within a BusProvider');
    }
    return context;
};