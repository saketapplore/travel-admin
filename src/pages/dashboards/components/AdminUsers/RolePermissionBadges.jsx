import React from 'react';
import { permissionsForRole, PERMISSION_LABELS } from '@/constants/adminRoleAccess';

/**
 * Shows the action-level access (View / Create / Edit / Delete) granted by the
 * selected role, alongside the module toggles. Read-only — these come from the
 * role definition, not per-user.
 */
const RolePermissionBadges = ({ role }) => {
  if (!role) return null;

  const perms = permissionsForRole(role);

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
        Access level for this role
      </p>
      <div className="flex flex-wrap gap-2">
        {PERMISSION_LABELS.map(({ key, label }) => {
          const granted = perms[key];
          return (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight border ${
                granted
                  ? 'bg-orange-50 border-orange-500 text-orange-600'
                  : 'bg-white border-gray-100 text-gray-300 line-through'
              }`}
            >
              {granted ? '✓' : '✕'} {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default RolePermissionBadges;
