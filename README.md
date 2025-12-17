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

### Super Admin (API Authentication)
- **API Endpoint**: `https://travel-rumours-api.applore.in/`
- **Method**: POST
- **Email**: `ayush.rajput@applore.in`
- **Password**: `Applore@123`

The login system authenticates via API. If API authentication succeeds, user is logged in as Super Admin with full permissions.

### Creating Other Accounts

The Super Admin can create accounts for:
- **Property Manager** - Can manage property details, availability, and bookings assigned to them
- **Booking Manager** - Can view and manage booking requests, confirmations, cancellations, and payments
- **Staff Manager** - Can onboard staff members, assign bookings, and manage staff roles

To create accounts:
1. Login as Super Admin using API credentials
2. Go to "Admin Accounts" section
3. Click "+ Create New Account"
4. Enter name, email, password, and select role
5. The account will be created and can be used to login (stored locally)

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

