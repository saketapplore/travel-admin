# Travel Rumours Admin Dashboard: Architecture Overview

This document provides a high-level overview of the refactored architecture of the Travel Admin Dashboard, aimed at providing a maintainable, scalable, and professional-grade codebase for handover.

## Key Principles

1.  **Modularity**: Monolithic components have been broken down into smaller, focused sub-components.
2.  **Separation of Concerns**: Business logic is decoupled from UI components using custom hooks.
3.  **Standardization**: Uniform folder structures, naming conventions, and code formatting (ESLint/Prettier).
4.  **Scalability**: Centralized constants, utilities, and service layers for easy expansion.

## Directory Structure

```text
src/
├── components/         # Shared, generic UI components
├── constants/          # Application-wide enums and static data
├── context/            # Global state management (Auth, Theme, etc.)
├── hooks/              # Reusable business logic and state hooks
├── pages/
│   └── dashboards/
│       └── components/ # Component-specific sub-modules
│           └── [Module]/
│               ├── index.jsx        # Module entry point (orchestrator)
│               ├── [SubComponent].jsx # Specialized UI pieces
│               └── use[Module].js    # Module-specific business logic
├── services/           # API communication layers
└── utils/              # Helper functions and formatters
```

## Refactored Modules

### 1. Booking Management
- **Hook**: `useBookings.js` handles data fetching, filtering, and pagination.
- **Components**: `BookingTable`, `BookingFilterBar`, and specialized modals for viewing/editing details.
- **Utilities**: `invoiceGenerator.js` for on-the-fly PDF/HTML invoice creation.

### 2. Admin User Management
- **Hook**: `useAdminUsers.js` manages admin accounts, roles, and activation status.
- **Components**: `UserTable`, `UserFilterBar`, and role-based access control for editing.

### 3. Roles & Permissions
- **Hook**: `useRolesPermissions.js` toggles between role and permission views.
- **Components**: `RoleList`, `PermissionList`, and `RoleModal` for fine-grained access control.

## Quality Infrastructure

- **ESLint**: Standardized rules for React and modern JavaScript.
- **Prettier**: Consistent code formatting across the entire project.
- **Vitest**: Unit testing framework for core logic and utilities.

## Handover Details

- **Path Aliases**: Uses `@/` to reference the `src` directory, eliminating fragile `../../` relative paths.
- **Tailwind CSS**: Consistent styling using a centralized theme configuration.
- **Modular Exports**: Each module is self-contained and exported via a clean index file.
