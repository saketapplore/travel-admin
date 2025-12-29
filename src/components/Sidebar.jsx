import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'properties', label: 'Property Management', icon: '🏢' },
    { id: 'admins', label: 'Admin Accounts', icon: '👥' },
    { id: 'users', label: 'Admin Users', icon: '👤' },
    { id: 'roles', label: 'Roles & Permissions', icon: '🔐' },
    { id: 'bookings', label: 'Booking Management', icon: '📅' },
    { id: 'discounts', label: 'Discounts & Packages', icon: '🎁' },
    { id: 'financial', label: 'Transactions', icon: '💰' },
    { id: 'reporting', label: 'Reporting & Analytics', icon: '📊' },
    { id: 'logs', label: 'Activity Logs', icon: '📝' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
  ];

  return (
    <aside className="lg:w-64 w-full mb-6 lg:mb-0 lg:fixed lg:left-6 lg:top-24 lg:h-[calc(100vh-7rem)] z-40">
      <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">Sections</h3>
        <nav className="space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === item.id
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

