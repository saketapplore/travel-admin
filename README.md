# Travel Admin Panel

A modern, role-based admin panel for managing travel properties, bookings, and staff.

## Features

- **Role-Based Access Control** with 4 different admin roles:
  - Super Admin
  - Property Manager
  - Booking Manager
  - Staff Manager

- **Modern UI** built with React, Vite, and Tailwind CSS
- **Secure Authentication** with hardcoded credentials for demo
- **Responsive Design** that works on all devices

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Login Credentials

### Super Admin
- Email: `superadmin@travelrumors.com`
- Password: `superadmin123`
- Can create, edit, and delete admin accounts and assign roles/permissions

### Property Manager
- Email: `propertymanager@travelrumors.com`
- Password: `property123`
- Can manage property details, availability, and bookings assigned to them

### Booking Manager
- Email: `bookingmanager@travelrumors.com`
- Password: `booking123`
- Can view and manage booking requests, confirmations, cancellations, and payments

### Staff Manager
- Email: `staffmanager@travelrumors.com`
- Password: `staff123`
- Can onboard staff members, assign bookings, and manage staff roles

## Technologies Used

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State management

## Project Structure

```
src/
├── components/
│   ├── DashboardLayout.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── dashboards/
│       ├── SuperAdminDashboard.jsx
│       ├── PropertyManagerDashboard.jsx
│       ├── BookingManagerDashboard.jsx
│       └── StaffManagerDashboard.jsx
├── App.jsx
└── main.jsx
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

