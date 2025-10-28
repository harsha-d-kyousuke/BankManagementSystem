
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, this would be a bcrypt hash
  accountNumber: string;
  balance: number;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  CORRECTION = 'correction',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // Positive for deposits/credits, negative for withdrawals/debits.
  from?: string; // Account number
  to?: string;   // Account number
  balanceAfter: number;
  description: string;
  timestamp: string;
}

// FIX: Add missing types for nutrition app features.
export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snacks = 'Snacks',
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface LoggedFood extends FoodItem {
  id: string;
  mealType: MealType;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}
