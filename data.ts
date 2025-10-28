
import { User, Transaction, UserRole, UserStatus, TransactionType } from './types';

// In a real application, this data would come from a secure database.
// Passwords are plain text here for demonstration; in production, they MUST be hashed.

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'customer@bankpro.com',
    passwordHash: 'password123', // Plain text for demo purposes
    accountNumber: '1234567890',
    balance: 15780.50,
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2022-01-15T09:00:00Z').toISOString(),
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'admin@bankpro.com',
    passwordHash: 'adminpass', // Plain text for demo purposes
    accountNumber: '0987654321',
    balance: 0,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2021-11-20T14:00:00Z').toISOString(),
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'txn-1',
        userId: 'user-1',
        type: TransactionType.DEPOSIT,
        amount: 5000,
        balanceAfter: 5000,
        description: 'Initial deposit',
        timestamp: new Date('2023-10-01T10:00:00Z').toISOString(),
    },
    {
        id: 'txn-2',
        userId: 'user-1',
        type: TransactionType.WITHDRAWAL,
        amount: 200,
        balanceAfter: 4800,
        description: 'ATM Withdrawal',
        timestamp: new Date('2023-10-05T18:30:00Z').toISOString(),
    },
    {
        id: 'txn-3',
        userId: 'user-1',
        type: TransactionType.TRANSFER,
        amount: 550.75,
        from: '1234567890',
        to: '1122334455',
        balanceAfter: 4249.25,
        description: 'Transfer to John Appleseed',
        timestamp: new Date('2023-10-12T12:15:00Z').toISOString(),
    },
    {
        id: 'txn-4',
        userId: 'user-1',
        type: TransactionType.DEPOSIT,
        amount: 2500,
        balanceAfter: 6749.25,
        description: 'Paycheck',
        timestamp: new Date('2023-11-01T09:05:00Z').toISOString(),
    },
    {
        id: 'txn-5',
        userId: 'user-1',
        type: TransactionType.WITHDRAWAL,
        amount: 120.50,
        balanceAfter: 6628.75,
        description: 'Grocery Store',
        timestamp: new Date('2023-11-03T16:45:00Z').toISOString(),
    },
    {
        id: 'txn-6',
        userId: 'user-1',
        type: TransactionType.TRANSFER,
        amount: 1200,
        from: '1234567890',
        to: '9988776655',
        balanceAfter: 5428.75,
        description: 'Rent Payment',
        timestamp: new Date('2023-12-01T08:00:00Z').toISOString(),
    },
     {
        id: 'txn-7',
        userId: 'user-1',
        type: TransactionType.DEPOSIT,
        amount: 2500,
        balanceAfter: 7928.75,
        description: 'Paycheck',
        timestamp: new Date('2023-12-01T09:06:00Z').toISOString(),
    },
    {
        id: 'txn-8',
        userId: 'user-1',
        type: TransactionType.WITHDRAWAL,
        amount: 75,
        balanceAfter: 7853.75,
        description: 'Coffee Shop',
        timestamp: new Date('2023-12-05T08:20:00Z').toISOString(),
    },
    {
        id: 'txn-9',
        userId: 'user-1',
        type: TransactionType.DEPOSIT,
        amount: 8000,
        balanceAfter: 15853.75,
        description: 'Project Bonus',
        timestamp: new Date('2023-12-15T14:00:00Z').toISOString(),
    },
     {
        id: 'txn-10',
        userId: 'user-1',
        type: TransactionType.WITHDRAWAL,
        amount: 73.25,
        balanceAfter: 15780.50,
        description: 'Dinner with friends',
        timestamp: new Date('2023-12-18T20:00:00Z').toISOString(),
    }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
