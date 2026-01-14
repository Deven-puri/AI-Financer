import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase_config';
import { BreadcrumbAndProfileProps } from '../../types';

const BreadcrumbAndProfile: React.FC<BreadcrumbAndProfileProps> = ({ breadcrumbItems, pageTitle }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestMode);
    
    if (!guestMode) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const username = isGuest ? 'Guest' : (user?.displayName || user?.email?.split('@')[0] || 'User');
  const role = isGuest ? 'Guest User' : 'Finance Manager';

  let welcomeMessage = `Welcome, ${username}`;
  let financialStatusSummary = "Here's a summary of your financial status.";

  if (pageTitle === 'Incomes') {
    welcomeMessage = `${username}, here are your incomes...`;
  } else if (pageTitle === 'Expenses') {
    welcomeMessage = `${username}, here are your expenses...`;
  } else if (pageTitle === 'Dashboard') {
    welcomeMessage = `Welcome back, ${username}`;
    financialStatusSummary = "Here's a summary of your overall financial status.";
  }

  return (
    <div className="mb-6 sm:mb-8">
      <nav className="flex items-center space-x-1 sm:space-x-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200 overflow-x-auto">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400 text-xs sm:text-sm">/</span>}
            <Link
              to={item.path}
              className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                item.active
                  ? 'text-black cursor-default font-bold'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 md:mb-0">
          {pageTitle}
        </h1>
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4 bg-white border-2 border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black flex items-center justify-center border-2 border-gray-300 flex-shrink-0">
            <span className="text-white font-bold text-base lg:text-lg">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm lg:text-base truncate">{username}</div>
            <div className="text-xs lg:text-sm text-gray-500">{role}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{welcomeMessage}</h3>
        <p className="text-sm sm:text-base text-gray-600">{financialStatusSummary}</p>
      </div>
    </div>
  );
};

export default BreadcrumbAndProfile;

