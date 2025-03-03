import React from 'react';
import { Menu, Bell, Globe, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, language, setLanguage } = useUser();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 text-xl font-semibold text-blue-600">MediResponse AI</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            
            <div className="relative">
              <button className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">
                <Globe size={20} />
                <span className="ml-1 text-sm">{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setLanguage(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user ? (
                    user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <span>{user.name.charAt(0)}</span>
                    )
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user ? user.name : 'Guest'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;