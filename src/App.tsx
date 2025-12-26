import React, { useState, useEffect, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase_config';
import SignIn from './components/SignIn/SignIn';
import Dashboard from './components/Dashboard/Dashboard';
import Incomes from './components/Incomes/Incomes';
import Expenses from './components/Expenses/Expenses';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Contact from './components/Contact/Contact';
import SignOut from './components/SignOut/SignOut';
import { DashboardShimmer, ExpensesShimmer } from './components/Shimmer/Shimmer';
import { Income, Expense } from './types';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return <DashboardShimmer />;
    } else if (location.pathname === '/incomes' || location.pathname === '/expenses' || location.pathname === '/ai-assistant' || location.pathname === '/contact') {
      return <ExpensesShimmer />;
    } else {
      return <DashboardShimmer />;
    }
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  const [incomes, setIncomes] = useState<Income[]>(() => {
    const savedIncomes = localStorage.getItem('incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const totalIncomes = incomes.reduce((total, income) => total + parseFloat(income.amount || '0'), 0);
  const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount || '0'), 0);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard totalIncomes={totalIncomes} totalExpenses={totalExpenses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <ProtectedRoute>
                <Incomes incomes={incomes} setIncomes={setIncomes} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistant incomes={incomes} expenses={expenses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses expenses={expenses} setExpenses={setExpenses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signout"
            element={
              <ProtectedRoute>
                <SignOut />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

