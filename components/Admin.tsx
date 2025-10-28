import React, { useState, useMemo } from 'react';
import { User, Transaction, UserStatus, TransactionType } from '../types';
import { AdjustmentsIcon } from './Icons';

interface AdminProps {
    currentUser: User;
    allUsers: User[];
    allTransactions: Transaction[];
    onUpdateUserStatus: (userId: string, status: UserStatus) => void;
    onCorrectBalance: (userId: string, amount: number, description: string) => void;
}

const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
    <div className="mt-4 overflow-x-auto">
        <h4 className="text-lg font-semibold text-slate-700 mb-2">Transaction History</h4>
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                    <th scope="col" className="px-4 py-3">Type</th>
                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                    <th scope="col" className="px-4 py-3 text-right">Balance</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(tx => {
                    const isCredit = tx.type === TransactionType.DEPOSIT || (tx.type === TransactionType.CORRECTION && tx.amount >= 0);
                    const amount = tx.amount
                    let typeStyle = 'bg-gray-100 text-gray-800';
                    if (isCredit) {
                        typeStyle = 'bg-green-100 text-green-800';
                    } else if (tx.type === TransactionType.WITHDRAWAL || tx.type === TransactionType.TRANSFER || (tx.type === TransactionType.CORRECTION && amount < 0)) {
                        typeStyle = 'bg-red-100 text-red-800';
                    }

                    return (
                        <tr key={tx.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleDateString()}</td>
                            <td className="px-4 py-2 font-medium text-slate-900">{tx.description}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyle}`}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className={`px-4 py-2 text-right font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                {isCredit ? '+' : ''}${amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-right">${tx.balanceAfter.toFixed(2)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        {transactions.length === 0 && <p className="text-center text-slate-500 py-4">No transactions found for this user.</p>}
    </div>
);


const Admin: React.FC<AdminProps> = ({ currentUser, allUsers, allTransactions, onUpdateUserStatus, onCorrectBalance }) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [correctionUserId, setCorrectionUserId] = useState<string>('');
    const [correctionAmount, setCorrectionAmount] = useState('');
    const [correctionDesc, setCorrectionDesc] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleCorrectionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numAmount = parseFloat(correctionAmount);
        if (!correctionUserId) {
            setError('Please select a user.');
            return;
        }
        if (isNaN(numAmount)) {
            setError('Please enter a valid amount.');
            return;
        }
         if (!correctionDesc.trim()) {
            setError('A description is required for all corrections.');
            return;
        }

        onCorrectBalance(correctionUserId, numAmount, correctionDesc);
        setCorrectionUserId('');
        setCorrectionAmount('');
        setCorrectionDesc('');
    };

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.accountNumber.includes(searchTerm)
        );
    }, [allUsers, searchTerm]);
    
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Admin Panel</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Management Panel */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">User Management</h3>
                     <input
                        type="text"
                        placeholder="Search by name, email, or account number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Account No.</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <React.Fragment key={user.id}>
                                        <tr className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{user.name}<br/><span className="text-xs text-slate-400">{user.email}</span></td>
                                            <td className="px-4 py-3">{user.accountNumber}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 space-x-2">
                                                <button onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                                                    {selectedUserId === user.id ? 'Hide Txns' : 'View Txns'}
                                                </button>
                                                <button 
                                                    onClick={() => onUpdateUserStatus(user.id, user.status === UserStatus.ACTIVE ? UserStatus.FROZEN : UserStatus.ACTIVE)}
                                                    disabled={user.id === currentUser.id}
                                                    className={`text-xs font-semibold disabled:text-slate-400 disabled:cursor-not-allowed ${user.status === UserStatus.ACTIVE ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                                                    {user.status === UserStatus.ACTIVE ? 'Freeze' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                        {selectedUserId === user.id && (
                                            <tr>
                                                <td colSpan={4} className="p-2 bg-slate-50">
                                                     <TransactionHistory transactions={allTransactions.filter(tx => tx.userId === user.id)} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Balance Correction Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <AdjustmentsIcon className="w-6 h-6 mr-2 text-blue-800" />
                            Balance Correction
                        </h3>
                        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="correctionUser" className="block text-sm font-medium text-slate-700">User</label>
                                <select id="correctionUser" value={correctionUserId} onChange={e => setCorrectionUserId(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="" disabled>Select a user</option>
                                    {allUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.accountNumber})</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="correctionAmount" className="block text-sm font-medium text-slate-700">Amount</label>
                                <input type="number" step="0.01" id="correctionAmount" value={correctionAmount} onChange={e => setCorrectionAmount(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 50.00 or -25.50" required />
                                <p className="text-xs text-slate-500 mt-1">Use a positive value for credit, negative for debit.</p>
                            </div>
                             <div>
                                <label htmlFor="correctionDesc" className="block text-sm font-medium text-slate-700">Description</label>
                                <input type="text" id="correctionDesc" value={correctionDesc} onChange={e => setCorrectionDesc(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Reason for correction" required />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <button type="submit" className="w-full bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                Apply Correction
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
