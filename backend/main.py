import mysql.connector
import os
from mysql.connector import errorcode
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


# --- Pydantic Models for Request/Response Validation ---

load_dotenv()


class BusBase(BaseModel):
    bus_name: str
    source: str
    destination: str
    fare_per_seat: float

class BusCreate(BusBase):
    total_seats: int

class Bus(BusBase):
    bus_id: int
    available_seats: int
    
    # This classmethod helps convert the database tuple to a Pydantic model
    @classmethod
    def from_db_tuple(cls, data):
        return cls(
            bus_id=data[0],
            bus_name=data[1],
            source=data[2],
            destination=data[3],
            available_seats=data[4],
            fare_per_seat=data[5]
        )

class BookingCreate(BaseModel):
    passenger_name: str
    age: int
    gender: str
    bus_id: int
    seats_to_book: int
    travel_date: date

class BookingConfirmation(BaseModel):
    message: str
    booking_id: int
    passenger_id: int
    total_fare: float
    travel_date: date

class BookingDetails(BaseModel):
    booking_id: int
    passenger_id: int
    bus_id: int
    seats_booked: int
    total_fare: float
    travel_date: date
    
# --- FastAPI App Initialization ---

app = FastAPI(
    title="🚌 Bus Ticket Booking System API",
    description="API for managing bus routes and bookings."
)


app.add_middleware(
    CORSMiddleware,
    allow_origins="*",       # Allows specific origins
    allow_credentials=True,    # Allows cookies (if you use them later)
    allow_methods=["*"],       # Allows all HTTP methods (GET, POST, DELETE)
    allow_headers=["*"],       # Allows all headers
)


# --- Database Connection ---



try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    cursor = conn.cursor(dictionary=True)
    print("Database connection successful!")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    # In a real app, you might exit or use a more robust retry/wait
    conn = None
    cursor = None

# Helper to check DB connection
def get_db_cursor():
    if not conn or not conn.is_connected() or not cursor:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    return cursor

# --- API Endpoints ---

### 🚌 Bus Routes (Public)

@app.get("/buses", response_model=List[Bus], tags=["Buses"])
def get_all_buses():
    """
    Replaces the `refresh_buses` function.
    Fetches a list of all available buses.
    """
    db_cursor = get_db_cursor()
    db_cursor.execute("SELECT bus_id, bus_name, source, destination, available_seats, fare_per_seat FROM Buses")
    buses = db_cursor.fetchall()
    # Manually convert dicts to the required tuple order for the old classmethod if not using dict cursor
    # With dictionary=True, this is simpler:
    return [Bus(**bus) for bus in buses]

### 🎟️ Booking Routes (User)

@app.post("/bookings", response_model=BookingConfirmation, status_code=status.HTTP_201_CREATED, tags=["Bookings"])
def create_booking(booking: BookingCreate):
    """
    Replaces the `confirm_booking` function.
    Books a new ticket.
    """
    db_cursor = get_db_cursor()
    
    try:
        # 1. Check if bus exists and has seats
        db_cursor.execute("SELECT available_seats, fare_per_seat FROM Buses WHERE bus_id=%s FOR UPDATE", (booking.bus_id,))
        bus_data = db_cursor.fetchone()
        
        if not bus_data:
            raise HTTPException(status_code=404, detail="Invalid Bus ID")
            
        available, fare = bus_data['available_seats'], bus_data['fare_per_seat']

        if available < booking.seats_to_book:
            raise HTTPException(status_code=400, detail="Not enough seats available!")

        # 2. Create Passenger
        total_fare = fare * booking.seats_to_book
        db_cursor.execute("INSERT INTO Passengers (name, age, gender) VALUES (%s,%s,%s)", 
                            (booking.passenger_name, booking.age, booking.gender))
        passenger_id = db_cursor.lastrowid
        
        # 3. Create Booking
        db_cursor.execute("""INSERT INTO Bookings (passenger_id,bus_id,seats_booked,total_fare,travel_date)
                            VALUES (%s,%s,%s,%s,%s)""", 
                            (passenger_id, booking.bus_id, booking.seats_to_book, total_fare, booking.travel_date))
        booking_id = db_cursor.lastrowid
        
        # 4. Update Bus Seats
        db_cursor.execute("UPDATE Buses SET available_seats=available_seats-%s WHERE bus_id=%s", 
                            (booking.seats_to_book, booking.bus_id))
        
        conn.commit()
        
        return BookingConfirmation(
            message="Booking Confirmed!",
            booking_id=booking_id,
            passenger_id=passenger_id,
            total_fare=total_fare,
            travel_date=booking.travel_date
        )

    except Exception as e:
        conn.rollback() # Roll back changes on error
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.delete("/bookings/{booking_id}", status_code=status.HTTP_200_OK, tags=["Bookings"])
def cancel_booking(booking_id: int):
    """
    Replaces the `cancel` function from `cancel_booking_window`.
    Cancels a booking by its ID.
    """
    db_cursor = get_db_cursor()
    
    try:
        # 1. Find the booking
        db_cursor.execute("SELECT bus_id, seats_booked FROM Bookings WHERE booking_id=%s FOR UPDATE", (booking_id,))
        booking_data = db_cursor.fetchone()
        
        if not booking_data:
            raise HTTPException(status_code=404, detail="Booking ID not found!")
            
        bus_id, seats = booking_data['bus_id'], booking_data['seats_booked']
        
        # 2. Delete the booking
        # Note: You might want to also delete the passenger, or keep them for records.
        # The original script didn't delete the passenger, so we won't either.
        db_cursor.execute("DELETE FROM Bookings WHERE booking_id=%s", (booking_id,))
        
        # 3. Restore seats to the bus
        db_cursor.execute("UPDATE Buses SET available_seats=available_seats+%s WHERE bus_id=%s", (seats, bus_id))
        
        conn.commit()
        
        return {"message": "Booking cancelled successfully!"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


### 🔧 Admin Routes

@app.post("/admin/buses", response_model=Bus, status_code=status.HTTP_201_CREATED, tags=["Admin"])
def add_new_bus(bus: BusCreate):
    """
    Replaces the `add_bus` function.
    Adds a new bus to the system.
    """
    db_cursor = get_db_cursor()
    
    try:
        db_cursor.execute("""INSERT INTO Buses (bus_name,source,destination,total_seats,available_seats,fare_per_seat)
                            VALUES (%s,%s,%s,%s,%s,%s)""",
                            (bus.bus_name,
                            bus.source,
                            bus.destination,
                            bus.total_seats,
                            bus.total_seats,  # Available seats = Total seats on creation
                            bus.fare_per_seat))
        conn.commit()
        bus_id = db_cursor.lastrowid
        
        # Return the newly created bus object
        return Bus(
            bus_id=bus_id,
            bus_name=bus.bus_name,
            source=bus.source,
            destination=bus.destination,
            available_seats=bus.total_seats,
            fare_per_seat=bus.fare_per_seat
        )

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.delete("/admin/buses/{bus_id}", status_code=status.HTTP_200_OK, tags=["Admin"])
def remove_bus(bus_id: int):
    """
    Replaces the `remove_bus` function.
    Removes a bus from the system using its ID.
    """
    db_cursor = get_db_cursor()
    
    try:
        # We should check if the bus exists first
        db_cursor.execute("SELECT bus_id FROM Buses WHERE bus_id=%s", (bus_id,))
        if not db_cursor.fetchone():
            raise HTTPException(status_code=404, detail="Bus ID not found!")
            
        # Note: This will fail if there are active bookings for this bus
        # due to foreign key constraints. This is desired behavior.
        # To allow deletion, you'd first need to delete all associated bookings.
        db_cursor.execute("DELETE FROM Buses WHERE bus_id=%s", (bus_id,))
        conn.commit()
        
        return {"message": "Bus removed successfully!"}

    except mysql.connector.Error as err:
        conn.rollback()
        if err.errno == errorcode.ER_ROW_IS_REFERENCED_2:
                raise HTTPException(status_code=400, detail="Cannot remove bus: it has active bookings.")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(err)}")

# --- Run the app (for development) ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
