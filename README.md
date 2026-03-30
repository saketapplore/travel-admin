# Travel Rumours Admin Panel

A modern, role-based admin panel for managing travel properties, bookings, and staff. This project has been refactored to meet production-ready standards for maintenance and scalability.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Super Admin, Property Manager, Booking Manager, and Staff Manager.
- **Modular Architecture**: Monolithic components broken into specialized sub-modules with custom hooks.
- **Production Infrastructure**: Built-in linting, formatting, and unit testing suite.
- **Premium UI**: Consistent, high-end design using solid themes and optimized React components.
- **Automated Invoices**: On-the-fly invoice generation for all bookings.

## 🛠️ Tech Stack

- **Core**: React 18, Vite 5, Tailwind CSS
- **Routing**: React Router 6
- **State**: Context API + Custom Hooks
- **Quality**: ESLint 9, Prettier, Vitest, JSDOM

## 📂 Project Structure

```text
src/
├── components/         # Shared UI components
├── constants/          # Application-wide enums
├── hooks/              # Reusable business logic
├── pages/
│   └── dashboards/
│       └── components/ # Refactored sub-modules (BookingManagement, AdminUsers, etc.)
├── services/           # API communication layer
└── utils/              # Helper functions (Formatters, Invoice Generator)
```

For detailed architecture info, see [Architecture Overview](./architecture_overview.md).

## 🏁 Getting Started

### Installation

```bash
npm install
```

### Running for Development

```bash
npm run dev
```

### Quality Assurance

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test:run
```

## 🔐 Login Credentials

### Super Admin (API Authentication)
- **API Endpoint**: `https://travel-rumours-api.applore.in/`
- **Email**: `ayush.rajput@applore.in`
- **Password**: `Applore@123`

## 🏗️ Building for Production

```bash
npm run build
npm run preview
```
