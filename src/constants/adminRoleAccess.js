// Module access for the 4 standard admin roles (Point 3).
// 'all' = every module; an array = exactly those module ids.
export const ROLE_MODULE_ACCESS = {
  'Super Admin': 'all',
  'Admin User': 'all',
  'Property Manager': ['reporting', 'financialSetting', 'bookings'],
  'Staff Manager': ['reporting', 'bookings']
};

/**
 * Build the module-access map for a selected role.
 * Prefers the role's own `modules` from the backend (source of truth); falls
 * back to the static mapping above by role name when the backend role has no
 * explicit modules set.
 */
export const modulesForRole = (role, allModuleIds) => {
  if (!role) {
    return allModuleIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
  }

  // 1. Use the backend role's module map when it actually grants something.
  if (
    role.modules &&
    typeof role.modules === 'object' &&
    Object.values(role.modules).some(Boolean)
  ) {
    return allModuleIds.reduce((acc, id) => ({ ...acc, [id]: !!role.modules[id] }), {});
  }

  // 2. Fall back to the standard access by role name.
  const access = ROLE_MODULE_ACCESS[role.name];
  const granted = access === 'all' ? allModuleIds : Array.isArray(access) ? access : [];
  return allModuleIds.reduce((acc, id) => ({ ...acc, [id]: granted.includes(id) }), {});
};

// Action-level permissions for the 4 standard admin roles (what they can DO in
// the modules they can access).
//   Super Admin / Admin User → full access
//   Property Manager         → view + edit
//   Staff Manager            → view only
export const ROLE_PERMISSIONS = {
  'Super Admin': { view: true, create: true, edit: true, delete: true },
  'Admin User': { view: true, create: true, edit: true, delete: true },
  'Property Manager': { view: true, create: false, edit: true, delete: false },
  'Staff Manager': { view: true, create: false, edit: false, delete: false }
};

const EMPTY_PERMISSIONS = { view: false, create: false, edit: false, delete: false };

/**
 * Resolve the action permissions for a selected role.
 * Prefers the backend role's own `permissions`; falls back to the standard
 * mapping above by role name.
 */
export const permissionsForRole = (role) => {
  if (!role) return { ...EMPTY_PERMISSIONS };

  const p = role.permissions;
  if (p && typeof p === 'object' && Object.values(p).some(Boolean)) {
    return {
      view: !!p.view,
      create: !!p.create,
      edit: !!p.edit,
      delete: !!p.delete
    };
  }

  return { ...EMPTY_PERMISSIONS, ...(ROLE_PERMISSIONS[role.name] || {}) };
};

// Labels for rendering permission chips.
export const PERMISSION_LABELS = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' }
];
