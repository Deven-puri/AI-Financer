export interface Income {
  id: number;
  name: string;
  amount: string;
  date: string;
  description: string;
  status: 'PAID' | 'DUE';
  category: string;
  photo?: string | null;
}

export interface Expense {
  id: number;
  name: string;
  amount: string;
  date: string;
  description: string;
  status: 'PAID' | 'DUE';
  category: string;
  photo?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
  active: boolean;
}

export interface InfoCardProps {
  title: string;
  value: string;
  linkText?: string;
  linkTo?: string;
}

export interface DashboardProps {
  totalIncomes: number;
  totalExpenses: number;
}

export interface IncomesProps {
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
}

export interface ExpensesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

export interface BreadcrumbAndProfileProps {
  breadcrumbItems: BreadcrumbItem[];
  pageTitle: string;
}

