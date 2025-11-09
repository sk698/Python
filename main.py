import tkinter as tk
import os
from tkinter import ttk, messagebox
import mysql.connector
from tkinter import simpledialog, messagebox
from tkcalendar import Calendar
from dotenv import load_dotenv

load_dotenv()

try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT"))
    )
    cursor = conn.cursor()
except:
    messagebox.showerror("Error", "Database connection failed!")

root = tk.Tk()
root.title("🚌 Bus Ticket Booking System")
root.geometry("900x600")
root.configure(bg="#f4f4f4")

def refresh_buses(tree):
    try:
        # Reconnect each time to get the latest data
        conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT"))
        )
        cursor = conn.cursor()

        # Clear old data
        for row in tree.get_children():
            tree.delete(row)

        # Fetch new data
        cursor.execute("SELECT bus_id, bus_name, source, destination, available_seats, fare_per_seat FROM Buses")
        for bus in cursor.fetchall():
            tree.insert("", "end", values=bus)

        conn.close()  # Always close connection after refresh

    except mysql.connector.Error as err:
        messagebox.showerror("Database Error", f"Error: {err}")


def book_ticket_window():
    win = tk.Toplevel(root)
    win.title("Book Ticket")
    win.geometry("400x400")
    tk.Label(win, text="Book Your Ticket", font=("Arial", 14, "bold")).pack(pady=10)

    tk.Label(win, text="Passenger Name").pack()
    name_entry = tk.Entry(win)
    name_entry.pack()

    tk.Label(win, text="Age").pack()
    age_entry = tk.Entry(win)
    age_entry.pack()

    tk.Label(win, text="Gender (M/F)").pack()
    gender_entry = tk.Entry(win)
    gender_entry.pack()

    tk.Label(win, text="Bus ID").pack()
    bus_entry = tk.Entry(win)
    bus_entry.pack()

    tk.Label(win, text="Seats to Book").pack()
    seat_entry = tk.Entry(win)
    seat_entry.pack()

    tk.Label(win, text="Select Travel Date").pack()
    cal = Calendar(win, selectmode='day', date_pattern='yyyy-mm-dd')
    cal.pack(pady=10)


    def confirm_booking():
        try:
            name = name_entry.get()
            age = int(age_entry.get())
            gender = gender_entry.get()
            bus_id = int(bus_entry.get())
            seats = int(seat_entry.get())
            date = cal.get_date()

            cursor.execute("SELECT available_seats, fare_per_seat FROM Buses WHERE bus_id=%s", (bus_id,))
            data = cursor.fetchone()
            if not data:
                messagebox.showerror("Error", "Invalid Bus ID")
                return
            available, fare = data

            if available < seats:
                messagebox.showwarning("Full", "Not enough seats available!")
                return

            total = fare * seats
            cursor.execute("INSERT INTO Passengers (name, age, gender) VALUES (%s,%s,%s)", (name, age, gender))
            pid = cursor.lastrowid
            cursor.execute("""INSERT INTO Bookings (passenger_id,bus_id,seats_booked,total_fare,travel_date)
                            VALUES (%s,%s,%s,%s,%s)""", (pid, bus_id, seats, total, date))
            cursor.execute("UPDATE Buses SET available_seats=available_seats-%s WHERE bus_id=%s", (seats, bus_id))
            conn.commit()
            messagebox.showinfo("Success", f"Booking Confirmed!\nTotal Fare: ₹{total}")
            win.destroy()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    tk.Button(win, text="Confirm Booking", command=confirm_booking, bg="green", fg="white").pack(pady=10)

def cancel_booking_window():
    win = tk.Toplevel(root)
    win.title("Cancel Ticket")
    win.geometry("300x200")
    tk.Label(win, text="Enter Booking ID").pack(pady=10)
    booking_id = tk.Entry(win)
    booking_id.pack()

    def cancel():
        try:
            bid = int(booking_id.get())
            cursor.execute("SELECT bus_id,seats_booked FROM Bookings WHERE booking_id=%s", (bid,))
            data = cursor.fetchone()
            if not data:
                messagebox.showwarning("Not Found", "Booking ID not found!")
                return
            bus_id, seats = data
            cursor.execute("DELETE FROM Bookings WHERE booking_id=%s", (bid,))
            cursor.execute("UPDATE Buses SET available_seats=available_seats+%s WHERE bus_id=%s", (seats, bus_id))
            conn.commit()
            messagebox.showinfo("Cancelled", "Booking cancelled successfully!")
            win.destroy()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    tk.Button(win, text="Cancel Booking", bg="red", fg="white", command=cancel).pack(pady=10)

def admin_panel():
    win = tk.Toplevel(root)
    win.title("Admin Panel")
    win.geometry("600x400")

    tk.Label(win, text="Admin Panel", font=("Arial", 14, "bold")).pack(pady=10)

    tree = ttk.Treeview(win, columns=("BusID","BusName","Source","Destination","Seats","Fare"), show="headings")
    for col in ("BusID","BusName","Source","Destination","Seats","Fare"):
        tree.heading(col, text=col)
    tree.pack(expand=True, fill="both")

    refresh_buses(tree)

    def add_bus():
        awin = tk.Toplevel(win)
        awin.title("Add New Bus")
        awin.geometry("300x350")
        labels = ["Bus Name", "Source", "Destination", "Total Seats", "Fare per Seat"]
        entries = {}
        for l in labels:
            tk.Label(awin, text=l).pack()
            e = tk.Entry(awin)
            e.pack()
            entries[l] = e

        def save_bus():
            try:
                cursor.execute("""INSERT INTO Buses (bus_name,source,destination,total_seats,available_seats,fare_per_seat)
                                VALUES (%s,%s,%s,%s,%s,%s)""",
                                (entries["Bus Name"].get(),
                                entries["Source"].get(),
                                entries["Destination"].get(),
                                int(entries["Total Seats"].get()),
                                int(entries["Total Seats"].get()),
                                float(entries["Fare per Seat"].get())))
                conn.commit()
                refresh_buses(tree)
                messagebox.showinfo("Success", "Bus Added Successfully!")
                awin.destroy()
            except Exception as e:
                messagebox.showerror("Error", str(e))

        tk.Button(awin, text="Add Bus", bg="blue", fg="white", command=save_bus).pack(pady=10)

    def remove_bus():
        bid = tk.simpledialog.askinteger("Remove Bus", "Enter Bus ID to remove:")
        if bid:
            cursor.execute("DELETE FROM Buses WHERE bus_id=%s", (bid,))
            conn.commit()
            refresh_buses(tree)
            messagebox.showinfo("Removed", "Bus removed successfully!")

    tk.Button(win, text="Add New Bus", command=add_bus, bg="green", fg="white").pack(side="left", padx=10)
    tk.Button(win, text="Remove Bus", command=remove_bus, bg="red", fg="white").pack(side="left")

tk.Label(root, text="🚌 BUS TICKET BOOKING SYSTEM", font=("Arial", 20, "bold"), bg="#f4f4f4", fg="blue").pack(pady=20)

tree = ttk.Treeview(root, columns=("BusID","BusName","Source","Destination","Seats","Fare"), show="headings")
for col in ("BusID","BusName","Source","Destination","Seats","Fare"):
    tree.heading(col, text=col)
tree.pack(expand=True, fill="both", pady=10)

refresh_buses(tree)

btn_frame = tk.Frame(root, bg="#f4f4f4")
btn_frame.pack(pady=10)

tk.Button(btn_frame, text="Book Ticket", command=book_ticket_window, bg="#4CAF50", fg="white", width=15).grid(row=0, column=0, padx=10)
tk.Button(btn_frame, text="Cancel Booking", command=cancel_booking_window, bg="#E53935", fg="white", width=15).grid(row=0, column=1, padx=10)
tk.Button(btn_frame, text="Admin Panel", command=admin_panel, bg="#1E88E5", fg="white", width=15).grid(row=0, column=2, padx=10)
tk.Button(btn_frame, text="Refresh", command=lambda: refresh_buses(tree), bg="#757575", fg="white", width=15).grid(row=0, column=3, padx=10)

def open_calendar():
    cal_win = tk.Toplevel(root)
    cal_win.title("Select Date")
    cal_win.geometry("300x300")

    cal = Calendar(cal_win, selectmode='day', date_pattern='yyyy-mm-dd')
    cal.pack(pady=20)

    def get_date():
        selected_date = cal.get_date()
        messagebox.showinfo("Selected Date", f"You picked: {selected_date}")
        cal_win.destroy()

    tk.Button(cal_win, text="Confirm", command=get_date, bg="green", fg="white").pack(pady=10)

# ---- MENU BAR ----
menubar = tk.Menu(root)
root.config(menu=menubar)

file_menu = tk.Menu(menubar, tearoff=0)
file_menu.add_command(label="Refresh", command=lambda: refresh_buses(tree))
file_menu.add_separator()
file_menu.add_command(label="Exit", command=root.quit)
menubar.add_cascade(label="File", menu=file_menu)

calendar_menu = tk.Menu(menubar, tearoff=0)
calendar_menu.add_command(label="Open Calendar", command=open_calendar)
menubar.add_cascade(label="Calendar", menu=calendar_menu)


root.mainloop()