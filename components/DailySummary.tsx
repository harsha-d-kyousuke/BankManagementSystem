
import React from 'react';
import { DailyTotals } from '../types';
import { FlameIcon, ProteinIcon, CarbsIcon, FatIcon } from './Icons';

interface DailySummaryProps {
  totals: DailyTotals;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string; color: string }> = ({ icon, label, value, unit, color }) => (
    <div className={`flex items-center p-3 rounded-lg bg-slate-100`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-sm text-slate-500">{label}</div>
            <div className="text-lg font-bold text-slate-800">
                {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
            </div>
        </div>
    </div>
);

const DailySummary: React.FC<DailySummaryProps> = ({ totals }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Daily Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={<FlameIcon />} label="Calories" value={totals.calories} unit="kcal" color="bg-orange-100 text-orange-600" />
        <StatCard icon={<ProteinIcon />} label="Protein" value={totals.protein} unit="g" color="bg-red-100 text-red-600" />
        <StatCard icon={<CarbsIcon />} label="Carbs" value={totals.carbohydrates} unit="g" color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={<FatIcon />} label="Fat" value={totals.fat} unit="g" color="bg-green-100 text-green-600" />
      </div>
    </div>
  );
};

export default DailySummary;
