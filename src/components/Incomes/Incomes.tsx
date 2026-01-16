import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';
import TopNav from '../TopNav/TopNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faArrowCircleLeft, faArrowCircleRight, faPlusCircle, faPenToSquare, faTrashCan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { IncomesProps, Income } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Incomes: React.FC<IncomesProps> = ({ incomes, setIncomes }) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [incomesPerPage] = useState<number>(5);
  const [category, setCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: string[] = ['Salary', 'Freelance', 'Investment', 'Other'];

  const exportToExcel = (): void => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "Incomes.xlsx");
  };

  const handleEdit = (income: Income): void => {
    setEditing(true);
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description);
    setIsPaid(income.status === "PAID");
    setCategory(income.category);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name || !amount || !date || !description || !category) {
      alert("All fields are required, including the category.");
      return;
    }
    const isConfirmed = window.confirm(editing ? "Are you sure you want to update this income?" : "Are you sure you want to add this income?");
    if (!isConfirmed) {
      return;
    }

    const incomeData: Income = {
      id: editing && currentIncome ? currentIncome.id : Date.now(),
      name,
      amount,
      date,
      description,
      status: isPaid ? "PAID" : "DUE",
      category,
    };

    if (editing && currentIncome) {
      setIncomes(incomes.map(income => income.id === currentIncome.id ? incomeData : income));
    } else {
      setIncomes([...incomes, incomeData]);
    }

    resetForm();
  };

  const resetForm = (): void => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setIsPaid(false);
    setEditing(false);
    setCurrentIncome(null);
    setCategory('');
  };

  const handleRemove = (id: number): void => {
    const isConfirmed = window.confirm("Are you sure you want to remove this income?");
    if (isConfirmed) {
      setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  const totalIncome = incomes.reduce((total, income) => total + parseFloat(income.amount || '0'), 0);

  const filteredIncomes = searchQuery.length > 0
    ? incomes.filter(income =>
        income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (income.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : incomes;

  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomes.slice(indexOfFirstIncome, indexOfLastIncome);

  const handlePreviousPage = (): void => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  };

  const handleNextPage = (): void => {
    setCurrentPage(prev => prev * incomesPerPage < filteredIncomes.length ? prev + 1 : prev);
  };

  const chartData = useMemo(() => {
    if (!incomes || incomes.length === 0) {
      return {
        labels: [] as string[],
        datasets: [
          {
            label: 'Total Income',
            data: [] as number[],
            fill: false,
            backgroundColor: 'rgba(24, 144, 255, 0.2)',
            borderColor: 'rgba(24, 144, 255, 1)',
            borderWidth: 2,
          },
        ],
      };
    }

    const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      labels: sortedIncomes.map(income => income.date),
      datasets: [
        {
          label: 'Total Income',
          data: sortedIncomes.map(income => parseFloat(income.amount || '0')),
          fill: false,
          backgroundColor: 'rgba(24, 144, 255, 0.2)',
          borderColor: 'rgba(24, 144, 255, 1)',
          borderWidth: 2,
          tension: 0.1,
        },
      ],
    };
  }, [incomes]);
  
  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Income (₹)',
        },
      },
    },
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <BreadcrumbAndProfile
          pageTitle="Incomes"
          breadcrumbItems={[
            { name: 'Dashboard', path: '/dashboard', active: false },
            { name: 'Incomes', path: '/incomes', active: true }
          ]}
        />

        <div className="mb-4 sm:mb-6 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search incomes..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">Total Income</h3>
              <p className="text-2xl sm:text-3xl font-bold text-black">₹{totalIncome.toFixed(2)}</p>
            </div>
          </motion.div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl">
            {incomes && incomes.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 text-sm sm:text-base">
                <p>No income data available for chart</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Income Name"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                placeholder="Short description"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                placeholder="Income Amount"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIsPaid(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700">Paid</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            {editing ? "Update Income" : "Add Income"}
            <FontAwesomeIcon icon={faPlusCircle} className="text-sm sm:text-base" />
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-lg mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Income List</h3>
            <div className="space-y-3 sm:space-y-4">
              {currentIncomes.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No incomes found</p>
              ) : (
                currentIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2 sm:mb-3">
                      <p className="text-gray-800 font-medium text-xs sm:text-sm leading-relaxed">
                        <span className="font-semibold">{income.name}</span> - Amount: ₹{income.amount} - Date: {income.date} - Type: {income.description} - Category: {income.category || 'Not specified'} - Status: {income.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(income)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-xs sm:text-sm" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleRemove(income.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs sm:text-sm" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <button
            onClick={exportToExcel}
            className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 sm:px-6 rounded-lg border-2 border-black transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <FontAwesomeIcon icon={faFileExcel} className="text-sm sm:text-base" />
            <span>Export to Excel</span>
          </button>

          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 disabled:transform-none transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} className="text-sm sm:text-base" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage * incomesPerPage >= filteredIncomes.length}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 disabled:transform-none transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faArrowCircleRight} className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incomes;

