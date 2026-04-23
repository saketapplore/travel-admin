import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Building2,
  Hotel,
  User,
  ShieldCheck,
  CalendarDays,
  Gift,
  CircleDollarSign,
  BarChart3,
  History,
  HelpCircle,
  BadgePercent
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Path for the icon
  const platformFeeImageIcon = '/src/assets/platform-fee.png';

  const menuItems = [
    { id: 'properties', label: 'Property Management', icon: <Building2 className="w-5 h-5" /> },
    { id: 'stays', label: 'Stay Management', icon: <Hotel className="w-5 h-5" /> },
    { id: 'users', label: 'Admin Users', icon: <User className="w-5 h-5" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'bookings', label: 'Booking Management', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'discounts', label: 'Discounts & Packages', icon: <Gift className="w-5 h-5" /> },
    { id: 'financial', label: 'Transactions', icon: <CircleDollarSign className="w-5 h-5" /> },
    {
      id: 'platform-fee',
      label: 'Financial Setting',
      icon: (
        <div className="w-5 h-5 flex items-center justify-center">
          <img
            src={platformFeeImageIcon}
            alt=""
            className="w-5 h-5 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <BadgePercent className="w-5 h-5" style={{ display: 'none' }} />
        </div>
      )
    },
    { id: 'reporting', label: 'Reporting & Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'logs', label: 'Activity Logs', icon: <History className="w-5 h-5" /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-5 h-5" /> }
  ];

  return (
    <aside className="lg:w-72 w-full mb-6 lg:mb-0 lg:fixed lg:left-6 lg:top-24 lg:h-[calc(100vh-7rem)] z-40">
      <div className="premium-glass rounded-3xl shadow-xl p-5 h-full flex flex-col border border-white/40">
        <div className="mb-6 flex-shrink-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-4">
            Dashboard
          </h3>
        </div>
        <nav className="space-y-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3.5 group relative ${
                activeSection === item.id
                  ? 'bg-orange-500 text-white font-semibold shadow-md'
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <div
                className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}
              >
                {item.icon}
              </div>
              <span className="whitespace-nowrap text-[0.95rem]">{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
              )}
            </button>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-gray-200/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3.5 group text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              <LogOut className="w-5 h-5 opacity-80" />
            </div>
            <span className="whitespace-nowrap text-[0.95rem]">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
