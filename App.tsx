
import React, { useState, useEffect } from 'react';
import { User, Transaction, UserRole, UserStatus, TransactionType } from './types';
import { MOCK_USERS, MOCK_TRANSACTIONS } from './data';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Admin from './components/Admin';
import Forbidden from './components/Forbidden';


type Page = 'dashboard' | 'analytics' | 'admin';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  // Persist login state
  useEffect(() => {
    const storedUser = localStorage.getItem('bankpro_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('bankpro_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bankpro_user');
    setCurrentPage('dashboard');
  };
  
  // In a real app, these handlers would make API calls to a secure backend.
  const handleSingleUserTransaction = (updatedUser: User, newTransaction: Transaction) => {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      setTransactions(prevTxns => [newTransaction, ...prevTxns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setCurrentUser(updatedUser); // Update current user state
      localStorage.setItem('bankpro_user', JSON.stringify(updatedUser)); // Update storage
  };

  const handleTransferTransaction = (
    updatedSender: User,
    updatedRecipient: User,
    senderTransaction: Transaction,
    recipientTransaction: Transaction
  ) => {
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === updatedSender.id) return updatedSender;
        if (u.id === updatedRecipient.id) return updatedRecipient;
        return u;
    }));
    setTransactions(prevTxns => [senderTransaction, recipientTransaction, ...prevTxns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    // Update current user state (who is the sender)
    setCurrentUser(updatedSender);
    localStorage.setItem('bankpro_user', JSON.stringify(updatedSender));
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prevUsers => prevUsers.map(u => (u.id === userId ? { ...u, status } : u)));
    // If the admin freezes the currently logged-in user (not themselves), update their state
    if (currentUser?.id === userId) {
        const updatedCurrentUser = { ...currentUser, status };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem('bankpro_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const handleCorrectBalance = (userId: string, adjustmentAmount: number, description: string) => {
    let updatedUser: User | null = null;
    
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userId) {
            const newBalance = parseFloat((u.balance + adjustmentAmount).toFixed(2));
            updatedUser = { ...u, balance: newBalance };
            return updatedUser;
        }
        return u;
    }));

    if (updatedUser) {
        const newTransaction: Transaction = {
            id: `txn-${new Date().getTime()}`,
            userId: userId,
            type: TransactionType.CORRECTION,
            amount: adjustmentAmount, // amount is signed
            description: description || 'Administrative Correction',
            timestamp: new Date().toISOString(),
            balanceAfter: updatedUser.balance,
        };
        setTransactions(prevTxns => [newTransaction, ...prevTxns].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

        // If the correction was for the current user, update their state
        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem('bankpro_user', JSON.stringify(updatedUser));
        }
    }
  };


  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  const userTransactions = transactions.filter(tx => tx.userId === currentUser.id);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
                  user={currentUser} 
                  transactions={userTransactions} 
                  onSingleUserTransaction={handleSingleUserTransaction}
                  onTransferTransaction={handleTransferTransaction}
                  allUsers={users} 
                />;
      case 'analytics':
        return <Analytics user={currentUser} transactions={userTransactions} />;
      case 'admin':
         if (currentUser.role !== UserRole.ADMIN) {
            return <Forbidden />;
         }
        return <Admin 
            currentUser={currentUser}
            allUsers={users}
            allTransactions={transactions}
            onUpdateUserStatus={handleUpdateUserStatus}
            onCorrectBalance={handleCorrectBalance}
        />;
      default:
        return <Dashboard 
                user={currentUser} 
                transactions={userTransactions} 
                onSingleUserTransaction={handleSingleUserTransaction}
                onTransferTransaction={handleTransferTransaction}
                allUsers={users} 
              />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={currentUser} onLogout={handleLogout} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
