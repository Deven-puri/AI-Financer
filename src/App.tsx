import React, { useState, useEffect, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase_config';
import { firestoreService } from './services/firestoreService';
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
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const guestMode = localStorage.getItem('isGuest') === 'true';
      setIsGuest(guestMode);
      
      if (guestMode) {
        setLoading(false);
        return;
      }
      
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    const cleanup = checkAuth();
    return cleanup;
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

  return (user || isGuest) ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const guestMode = localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestMode);
    
    if (guestMode) {
      const guestUserId = localStorage.getItem('guestUserId') || `guest_${Date.now()}`;
      localStorage.setItem('guestUserId', guestUserId);
      
      const savedIncomes = localStorage.getItem(`incomes_${guestUserId}`);
      const savedExpenses = localStorage.getItem(`expenses_${guestUserId}`);
      
      if (savedIncomes) {
        try {
          const parsed = JSON.parse(savedIncomes);
          setIncomes(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error('Error parsing guest incomes:', e);
          setIncomes([]);
        }
      }
      
      if (savedExpenses) {
        try {
          const parsed = JSON.parse(savedExpenses);
          setExpenses(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error('Error parsing guest expenses:', e);
          setExpenses([]);
        }
      }
      
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userId = currentUser.uid;
        
        try {
          const allKeys = Object.keys(localStorage);
          const expenseKeys = allKeys.filter(k => k.toLowerCase().includes('expense'));
          const incomeKeys = allKeys.filter(k => k.toLowerCase().includes('income'));
          
          let savedIncomes = localStorage.getItem(`incomes_${userId}`) || localStorage.getItem('incomes');
          let savedExpenses = localStorage.getItem(`expenses_${userId}`) || localStorage.getItem('expenses');
          
          if (!savedExpenses && expenseKeys.length > 0) {
            for (const key of expenseKeys) {
              const data = localStorage.getItem(key);
              if (data) {
                try {
                  const parsed = JSON.parse(data);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    savedExpenses = data;
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          }
          
          if (!savedIncomes && incomeKeys.length > 0) {
            for (const key of incomeKeys) {
              const data = localStorage.getItem(key);
              if (data) {
                try {
                  const parsed = JSON.parse(data);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    savedIncomes = data;
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          }
          
          let firestoreIncomes: Income[] = [];
          let firestoreExpenses: Expense[] = [];
          
          try {
            [firestoreIncomes, firestoreExpenses] = await Promise.all([
              firestoreService.getIncomes(userId),
              firestoreService.getExpenses(userId)
            ]);
          } catch (firestoreError: any) {
          }

          if (firestoreIncomes.length > 0) {
            setIncomes(firestoreIncomes);
            localStorage.setItem(`incomes_${userId}`, JSON.stringify(firestoreIncomes));
          } else if (savedIncomes) {
            try {
              const parsed = JSON.parse(savedIncomes);
              if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                setIncomes(parsed);
                firestoreService.syncIncomes(userId, parsed).catch(error => {
                  console.error('Error syncing incomes to Firestore:', error);
                });
              } else {
                setIncomes([]);
              }
            } catch (e) {
              console.error('Error parsing incomes from localStorage:', e);
              setIncomes([]);
            }
          } else {
            setIncomes([]);
          }

          if (firestoreExpenses.length > 0) {
            setExpenses(firestoreExpenses);
            localStorage.setItem(`expenses_${userId}`, JSON.stringify(firestoreExpenses));
          } else if (savedExpenses) {
            try {
              const parsed = JSON.parse(savedExpenses);
              if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                setExpenses(parsed);
                localStorage.setItem(`expenses_${userId}`, JSON.stringify(parsed));
                firestoreService.syncExpenses(userId, parsed).catch(error => {
                  console.error('Error syncing expenses to Firestore:', error);
                });
              } else {
                setExpenses([]);
              }
            } catch (e) {
              console.error('Error parsing expenses from localStorage:', e);
              setExpenses([]);
            }
          } else {
            setExpenses([]);
          }
        } catch (error) {
          console.error('Error loading data from Firestore:', error);
          const savedIncomes = localStorage.getItem(`incomes_${currentUser.uid}`) || localStorage.getItem('incomes');
          const savedExpenses = localStorage.getItem(`expenses_${currentUser.uid}`) || localStorage.getItem('expenses');
          
          if (savedIncomes) {
            try {
              const parsed = JSON.parse(savedIncomes);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setIncomes(parsed);
                localStorage.setItem(`incomes_${currentUser.uid}`, JSON.stringify(parsed));
              } else {
                setIncomes([]);
              }
            } catch (e) {
              console.error('Error parsing incomes from localStorage:', e);
              setIncomes([]);
            }
          } else {
            setIncomes([]);
          }
          
          if (savedExpenses) {
            try {
              const parsed = JSON.parse(savedExpenses);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setExpenses(parsed);
                localStorage.setItem(`expenses_${currentUser.uid}`, JSON.stringify(parsed));
              } else {
                setExpenses([]);
              }
            } catch (e) {
              console.error('Error parsing expenses from localStorage:', e);
              setExpenses([]);
            }
          } else {
            setExpenses([]);
          }
        }
      } else {
        setIncomes([]);
        setExpenses([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isGuest) {
      const guestUserId = localStorage.getItem('guestUserId') || `guest_${Date.now()}`;
      localStorage.setItem(`incomes_${guestUserId}`, JSON.stringify(incomes));
    } else if (user) {
      localStorage.setItem(`incomes_${user.uid}`, JSON.stringify(incomes));
      if (incomes.length > 0) {
        firestoreService.syncIncomes(user.uid, incomes).catch(error => {
          console.error('Error syncing incomes to Firestore:', error);
        });
      }
    }
  }, [incomes, user, isGuest]);

  useEffect(() => {
    if (isGuest) {
      const guestUserId = localStorage.getItem('guestUserId') || `guest_${Date.now()}`;
      localStorage.setItem(`expenses_${guestUserId}`, JSON.stringify(expenses));
    } else if (user) {
      localStorage.setItem(`expenses_${user.uid}`, JSON.stringify(expenses));
      if (expenses.length > 0) {
        firestoreService.syncExpenses(user.uid, expenses).catch(error => {
          console.error('Error syncing expenses to Firestore:', error);
        });
      }
    }
  }, [expenses, user, isGuest]);

  const totalIncomes = incomes.reduce((total, income) => total + parseFloat(income.amount || '0'), 0);
  const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount || '0'), 0);

  if (loading) {
    return <DashboardShimmer />;
  }

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

