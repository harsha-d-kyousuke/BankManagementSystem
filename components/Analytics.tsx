import React, { useMemo } from 'react';
import { User, Transaction, TransactionType } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsProps {
  user: User;
  transactions: Transaction[];
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: true,
            font: {
                size: 16
            },
            padding: {
                bottom: 20
            }
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{title}</h3>
        <div className="relative h-80">
            {children}
        </div>
    </div>
);


const MonthlyActivityChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = useMemo(() => {
        const monthlyData: { [key: string]: { deposits: number; withdrawals: number } } = {};
        
        [...transactions].reverse().forEach(tx => {
            const month = new Date(tx.timestamp).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) {
                monthlyData[month] = { deposits: 0, withdrawals: 0 };
            }
            if (tx.amount >= 0) { // Deposits and positive corrections
                monthlyData[month].deposits += tx.amount;
            } else { // Withdrawals, transfers, and negative corrections
                monthlyData[month].withdrawals += Math.abs(tx.amount);
            }
        });

        const labels = Object.keys(monthlyData);
        return {
            labels,
            datasets: [
                {
                    label: 'Deposits',
                    data: labels.map(m => monthlyData[m].deposits),
                    backgroundColor: '#16A34A', // Success color
                },
                {
                    label: 'Withdrawals & Transfers',
                    data: labels.map(m => monthlyData[m].withdrawals),
                    backgroundColor: '#DC2626', // Error color
                },
            ],
        };
    }, [transactions]);
    
    return <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Deposits vs Withdrawals' }}}} data={data} />;
};

const TransactionTypeChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = useMemo(() => {
        const typeCounts: { [key in TransactionType]: number } = {
            [TransactionType.DEPOSIT]: 0,
            [TransactionType.WITHDRAWAL]: 0,
            [TransactionType.TRANSFER]: 0,
            [TransactionType.CORRECTION]: 0,
        };

        transactions.forEach(tx => typeCounts[tx.type]++);

        return {
            labels: ['Deposits', 'Withdrawals', 'Transfers', 'Corrections'],
            datasets: [{
                data: [typeCounts.deposit, typeCounts.withdrawal, typeCounts.transfer, typeCounts.correction],
                backgroundColor: ['#16A34A', '#FBBF24', '#3B82F6', '#64748B'],
                borderColor: '#FFFFFF',
                borderWidth: 2,
            }]
        }
    }, [transactions]);
    return <Pie options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Transaction Type Ratio (by count)' }}}} data={data} />;
};


const CashFlowChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = useMemo(() => {
        const cashFlow = { incoming: 0, outgoing: 0 };
        transactions.forEach(tx => {
            if (tx.amount >= 0) {
                cashFlow.incoming += tx.amount;
            } else {
                cashFlow.outgoing += Math.abs(tx.amount);
            }
        });

        return {
            labels: ['Incoming', 'Outgoing'],
            datasets: [{
                data: [cashFlow.incoming, cashFlow.outgoing],
                backgroundColor: ['#1E3A8A', '#94A3B8'],
                borderColor: '#FFFFFF',
                borderWidth: 2,
            }]
        }
    }, [transactions]);
    return <Doughnut options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Incoming vs Outgoing Cash Flow (by amount)' }}}} data={data} />;
};


const BalanceHistoryChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = useMemo(() => {
        const reversedTx = [...transactions].reverse();
        return {
            labels: reversedTx.map(tx => new Date(tx.timestamp).toLocaleDateString()),
            datasets: [{
                label: 'Balance',
                data: reversedTx.map(tx => tx.balanceAfter),
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6', // Accent color
                tension: 0.1,
            }]
        }
    }, [transactions]);
    return <Line options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Historical Balance' }}}} data={data} />;
};

const Analytics: React.FC<AnalyticsProps> = ({ user, transactions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <ChartWrapper title="Spending vs Savings">
            <MonthlyActivityChart transactions={transactions} />
        </ChartWrapper>
        <ChartWrapper title="Financial Growth">
            <BalanceHistoryChart transactions={transactions} />
        </ChartWrapper>
        <ChartWrapper title="Banking Usage">
            <TransactionTypeChart transactions={transactions} />
        </ChartWrapper>
        <ChartWrapper title="Cash Flow">
            <CashFlowChart transactions={transactions} />
        </ChartWrapper>
    </div>
  );
};

export default Analytics;
