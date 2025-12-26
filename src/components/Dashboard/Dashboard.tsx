import React from 'react';
import TopNav from '../TopNav/TopNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { DashboardProps } from '../../types';

const Dashboard: React.FC<DashboardProps> = ({ totalIncomes, totalExpenses }) => {
  const total = totalIncomes + totalExpenses;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <BreadcrumbAndProfile
          pageTitle="Dashboard"
          breadcrumbItems={[
            { name: 'Dashboard', path: '/dashboard', active: true },
            { name: 'Welcome', path: '/welcome', active: true }
          ]}
        />

        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleReload}
            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-sm sm:text-base" />
            <span className="hidden sm:inline">Reload</span>
            <span className="sm:hidden">Reload</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InfoCard
              title="Total"
              value={`₹${total.toFixed(2)}`}
              linkText="View details"
              linkTo="/dashboard"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InfoCard
              title="Incomes"
              value={`₹${totalIncomes.toFixed(2)}`}
              linkText="Add or manage your Income"
              linkTo="/incomes"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <InfoCard
              title="Expenses"
              value={`₹${totalExpenses.toFixed(2)}`}
              linkText="Add or manage your expenses"
              linkTo="/expenses"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

