import React, { useState } from 'react';
import { User, Transaction, TransactionType, UserStatus } from '../types';
import { DepositIcon, TransferIcon, WithdrawalIcon, ArrowDownIcon, ArrowUpIcon } from './Icons';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onTransaction: (user: User, transaction: Transaction) => void;
  allUsers: User[];
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
);

const TransactionForm: React.FC<{
    user: User;
    onTransaction: (user: User, transaction: Transaction) => void;
    allUsers: User[];
}> = ({ user, onTransaction, allUsers }) => {
    const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.DEPOSIT);
    const [amount, setAmount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const isFrozen = user.status === UserStatus.FROZEN;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }

        let newUserState = { ...user };
        let newTransaction: Omit<Transaction, 'id' | 'timestamp' | 'balanceAfter'>;

        switch (activeTab) {
            case TransactionType.DEPOSIT:
                newUserState.balance += numAmount;
                newTransaction = { userId: user.id, type: TransactionType.DEPOSIT, amount: numAmount, description: description || 'Cash Deposit' };
                break;
            case TransactionType.WITHDRAWAL:
                if (numAmount > user.balance) {
                    setError('Insufficient funds for this withdrawal.');
                    return;
                }
                newUserState.balance -= numAmount;
                newTransaction = { userId: user.id, type: TransactionType.WITHDRAWAL, amount: -numAmount, description: description || 'Cash Withdrawal' };
                break;
            case TransactionType.TRANSFER:
                 if (numAmount > user.balance) {
                    setError('Insufficient funds for this transfer.');
                    return;
                }
                const recipient = allUsers.find(u => u.accountNumber === toAccount && u.id !== user.id);
                if (!recipient) {
                    setError('Recipient account number is invalid or is your own account.');
                    return;
                }
                newUserState.balance -= numAmount;
                newTransaction = { userId: user.id, type: TransactionType.TRANSFER, amount: -numAmount, from: user.accountNumber, to: toAccount, description: description || `Transfer to ${recipient.name}`};
                break;
            default:
                return;
        }
        
        const finalTransaction: Transaction = {
            ...newTransaction,
            id: `txn-${new Date().getTime()}`,
            timestamp: new Date().toISOString(),
            balanceAfter: newUserState.balance,
        };
        
        onTransaction(newUserState, finalTransaction);
        
        // Reset form
        setAmount('');
        setToAccount('');
        setDescription('');
    };

    const tabs = [
        { type: TransactionType.DEPOSIT, icon: <DepositIcon />, label: 'Deposit' },
        { type: TransactionType.WITHDRAWAL, icon: <WithdrawalIcon />, label: 'Withdraw' },
        { type: TransactionType.TRANSFER, icon: <TransferIcon />, label: 'Transfer' },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            {isFrozen && (
                 <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Account Frozen</p>
                    <p>Your account is currently frozen. You cannot perform transactions.</p>
                </div>
            )}
            <fieldset disabled={isFrozen}>
                <div className="mb-4 border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button key={tab.type} onClick={() => setActiveTab(tab.type)}
                                className={`${activeTab === tab.type ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                                flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                            {React.cloneElement(tab.icon, { className: 'h-5 w-5 mr-2' })} {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount</label>
                        <input type="number" name="amount" id="amount" value={amount} onChange={e => setAmount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00" required />
                    </div>
                    {activeTab === 'transfer' && (
                        <div>
                            <label htmlFor="toAccount" className="block text-sm font-medium text-slate-700">Recipient Account Number</label>
                            <input type="text" name="toAccount" id="toAccount" value={toAccount} onChange={e => setToAccount(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="10-digit account number" required />
                        </div>
                    )}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                        <input type="text" name="description" id="description" value={description} onChange={e => setDescription(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Monthly savings" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center disabled:bg-slate-400">
                        Submit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </button>
                </form>
            </fieldset>
        </div>
    );
};


const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        <th scope="col" className="px-6 py-3 text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => {
                       const isCredit = tx.type === TransactionType.DEPOSIT || (tx.type === TransactionType.CORRECTION && tx.amount >= 0);
                       const displayAmount = (tx.type === TransactionType.CORRECTION) ? tx.amount : tx.amount;
                       
                       let typeStyle = 'bg-gray-100 text-gray-800';
                       if (isCredit) {
                           typeStyle = 'bg-green-100 text-green-800';
                       } else if (tx.type === TransactionType.WITHDRAWAL || tx.type === TransactionType.TRANSFER || (tx.type === TransactionType.CORRECTION && tx.amount < 0)) {
                           typeStyle = 'bg-red-100 text-red-800';
                       }
                       
                       return (
                        <tr key={tx.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4">{new Date(tx.timestamp).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{tx.description}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyle}`}>
                                   {tx.type}
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                {isCredit ? '+' : ''}${displayAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right">${tx.balanceAfter.toFixed(2)}</td>
                        </tr>
                       )
                    })}
                </tbody>
            </table>
        </div>
        {transactions.length === 0 && <p className="text-center text-slate-500 py-8">No transactions found.</p>}
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onTransaction, allUsers }) => {
  return (
    <div className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <StatCard title="Current Balance" value={`$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
            <StatCard title="Account Number" value={user.accountNumber} />
            <StatCard title="Account Status" value={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
                <TransactionForm user={user} onTransaction={onTransaction} allUsers={allUsers} />
            </div>
            <div className="lg:col-span-2">
                <TransactionHistory transactions={transactions} />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
