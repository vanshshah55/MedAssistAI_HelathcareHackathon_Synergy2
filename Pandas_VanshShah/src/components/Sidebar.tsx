import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Stethoscope, 
  Boxes, 
  Settings,
  LogOut
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const { user } = useUser();
  
  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/patients', icon: <Users size={20} />, label: 'Patients' },
    { path: '/triage', icon: <Activity size={20} />, label: 'AI Triage' },
    { path: '/treatment', icon: <Stethoscope size={20} />, label: 'Treatment' },
    { path: '/resources', icon: <Boxes size={20} />, label: 'Resources' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside 
      className={`${
        open ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <h1 className="text-xl font-bold">MediResponse AI</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                >
                  <div className="mr-3">{item.icon}</div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {user && (
          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-blue-300">{user.role}</p>
              </div>
            </div>
            <button className="mt-3 flex items-center text-sm text-blue-300 hover:text-white w-full">
              <LogOut size={16} className="mr-2" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;