import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase_config';
import { Income, Expense } from '../types';

const getIncomesCollection = (userId: string) => collection(db, 'users', userId, 'incomes');
const getExpensesCollection = (userId: string) => collection(db, 'users', userId, 'expenses');

export const firestoreService = {
  async getIncomes(userId: string): Promise<Income[]> {
    try {
      let querySnapshot;
      try {
        const q = query(getIncomesCollection(userId), orderBy('date', 'desc'));
        querySnapshot = await getDocs(q);
      } catch (orderByError: any) {
        if (orderByError?.code === 'failed-precondition' || orderByError?.message?.includes('index')) {
          querySnapshot = await getDocs(getIncomesCollection(userId));
        } else {
          throw orderByError;
        }
      }
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id || parseInt(doc.id) || Date.now()
        } as Income;
      });
    } catch (error) {
      console.error('Error fetching incomes:', error);
      return [];
    }
  },

  async addIncome(userId: string, income: Income): Promise<void> {
    try {
      await addDoc(getIncomesCollection(userId), {
        ...income,
        id: income.id,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  },

  async updateIncome(userId: string, income: Income): Promise<void> {
    try {
      const q = query(getIncomesCollection(userId), where('id', '==', income.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const incomeRef = doc(getIncomesCollection(userId), querySnapshot.docs[0].id);
        await updateDoc(incomeRef, {
          ...income,
          updatedAt: Timestamp.now()
        });
      } else {
        await this.addIncome(userId, income);
      }
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  },

  async deleteIncome(userId: string, incomeId: number): Promise<void> {
    try {
      const q = query(getIncomesCollection(userId), where('id', '==', incomeId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const incomeRef = doc(getIncomesCollection(userId), querySnapshot.docs[0].id);
        await deleteDoc(incomeRef);
      }
    } catch (error) {
      console.error('Error deleting income:', error);
      throw error;
    }
  },

  async getExpenses(userId: string): Promise<Expense[]> {
    try {
      let querySnapshot;
      try {
        const q = query(getExpensesCollection(userId), orderBy('date', 'desc'));
        querySnapshot = await getDocs(q);
      } catch (orderByError: any) {
        if (orderByError?.code === 'failed-precondition' || orderByError?.message?.includes('index')) {
          querySnapshot = await getDocs(getExpensesCollection(userId));
        } else {
          throw orderByError;
        }
      }
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id || parseInt(doc.id) || Date.now()
        } as Expense;
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  async addExpense(userId: string, expense: Expense): Promise<void> {
    try {
      await addDoc(getExpensesCollection(userId), {
        ...expense,
        id: expense.id,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  async updateExpense(userId: string, expense: Expense): Promise<void> {
    try {
      const q = query(getExpensesCollection(userId), where('id', '==', expense.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const expenseRef = doc(getExpensesCollection(userId), querySnapshot.docs[0].id);
        await updateDoc(expenseRef, {
          ...expense,
          updatedAt: Timestamp.now()
        });
      } else {
        await this.addExpense(userId, expense);
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  async deleteExpense(userId: string, expenseId: number): Promise<void> {
    try {
      const q = query(getExpensesCollection(userId), where('id', '==', expenseId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const expenseRef = doc(getExpensesCollection(userId), querySnapshot.docs[0].id);
        await deleteDoc(expenseRef);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  async syncIncomes(userId: string, incomes: Income[]): Promise<void> {
    try {
      const existingIncomes = await this.getIncomes(userId);
      const existingIds = new Set(existingIncomes.map(inc => inc.id));
      const currentIds = new Set(incomes.map(inc => inc.id));
      
      for (const income of incomes) {
        if (existingIds.has(income.id)) {
          await this.updateIncome(userId, income);
        } else {
          await this.addIncome(userId, income);
        }
      }
      
      for (const existingIncome of existingIncomes) {
        if (!currentIds.has(existingIncome.id)) {
          await this.deleteIncome(userId, existingIncome.id);
        }
      }
    } catch (error) {
      console.error('Error syncing incomes:', error);
      throw error;
    }
  },

  async syncExpenses(userId: string, expenses: Expense[]): Promise<void> {
    try {
      const existingExpenses = await this.getExpenses(userId);
      const existingIds = new Set(existingExpenses.map(exp => exp.id));
      const currentIds = new Set(expenses.map(exp => exp.id));
      
      for (const expense of expenses) {
        if (existingIds.has(expense.id)) {
          await this.updateExpense(userId, expense);
        } else {
          await this.addExpense(userId, expense);
        }
      }
      
      for (const existingExpense of existingExpenses) {
        if (!currentIds.has(existingExpense.id)) {
          await this.deleteExpense(userId, existingExpense.id);
        }
      }
    } catch (error) {
      console.error('Error syncing expenses:', error);
      throw error;
    }
  }
};
