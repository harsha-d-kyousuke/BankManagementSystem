
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DashboardIcon, AnalyticsIcon, AdminIcon, LogoutIcon, Logo } from './Icons';

type Page = 'dashboard' | 'analytics' | 'admin';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => (
     <button
        onClick={() => setCurrentPage(page)}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentPage === page
            ? 'bg-blue-800 text-white'
            : 'text-slate-300 hover:bg-blue-600 hover:text-white'
        }`}
      >
        {children}
      </button>
);

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, setCurrentPage, currentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-blue-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
                <Logo className="h-8 w-auto text-white" />
                <span className="text-white text-xl font-bold">BankPro</span>
            </div>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                 <NavLink page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage}>
                    <DashboardIcon className="h-5 w-5 mr-2" /> Dashboard
                 </NavLink>
                 <NavLink page="analytics" currentPage={currentPage} setCurrentPage={setCurrentPage}>
                    <AnalyticsIcon className="h-5 w-5 mr-2" /> Analytics
                 </NavLink>
                {user.role === UserRole.ADMIN && (
                  <NavLink page="admin" currentPage={currentPage} setCurrentPage={setCurrentPage}>
                    <AdminIcon className="h-5 w-5 mr-2" /> Admin
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="max-w-xs bg-blue-900 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                    </div>
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-slate-700 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <LogoutIcon className="h-5 w-5 mr-2 text-slate-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
