-- Create the database
CREATE DATABASE bus_db;
USE bus_db;

-- Create Buses table
CREATE TABLE Buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    fare_per_seat DECIMAL(10,2) NOT NULL CHECK (fare_per_seat > 0)
);

-- Create Passengers table
CREATE TABLE Passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age > 0),
    gender VARCHAR(10)
);

-- Create Bookings table
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    bus_id INT,
    seats_booked INT,
    total_fare DECIMAL(10,2),
    travel_date DATE,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id),
    FOREIGN KEY (bus_id) REFERENCES Buses(bus_id)
);

-- Create BusSchedule table
CREATE TABLE BusSchedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    departure_time TIME,
    arrival_time TIME,
    travel_date DATE,
    FOREIGN KEY (bus_id) REFERENCES Buses(bus_id)
);

-- Insert bus records
INSERT INTO Buses (bus_name, source, destination, total_seats, available_seats, fare_per_seat)
VALUES
('Volvo Express', 'Delhi', 'Jaipur', 40, 40, 550.00),
('InterCity Deluxe', 'Mumbai', 'Pune', 50, 50, 400.00),
('GreenLine Travels', 'Bangalore', 'Chennai', 45, 45, 650.00),
('CityLink Express', 'Lucknow', 'Delhi', 35, 35, 500.00);

-- Insert bus schedule records
INSERT INTO BusSchedule (bus_id, departure_time, arrival_time, travel_date)
VALUES
(1, '09:00:00', '13:00:00', '2025-11-10'),
(2, '07:00:00', '10:00:00', '2025-11-11'),
(3, '06:30:00', '11:00:00', '2025-11-12'),
(4, '08:00:00', '14:30:00', '2025-11-13');
