import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHome, faWallet, faDollarSign, faSignOutAlt, faBars, faTimes, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  path: string;
  icon: IconDefinition;
  label: string;
}

const TopNav: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { path: '/dashboard', icon: faHome, label: 'Dashboard' },
    { path: '/incomes', icon: faDollarSign, label: 'Incomes' },
    { path: '/ai-assistant', icon: faRobot, label: 'AI Assistant' },
    { path: '/expenses', icon: faWallet, label: 'Expenses' },
    { path: '/contact', icon: faUser, label: 'Contact' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
            <Link to="/dashboard" className="flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/Logo/NEW AI Financer.png`}
                alt="AI Financer Logo"
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
                style={{ mixBlendMode: 'normal', backgroundColor: 'transparent' }}
              />
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                    isActive(item.path)
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-xs sm:text-sm" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link
                to="/signout"
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm lg:text-base"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-xs sm:text-sm" />
                <span className="font-medium">Sign Out</span>
              </Link>
              
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-black hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-3 sm:px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    isActive(item.path)
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-sm sm:text-base" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Link
                to="/signout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-black hover:bg-gray-100 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-sm sm:text-base" />
                <span className="font-medium">Sign Out</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopNav;

