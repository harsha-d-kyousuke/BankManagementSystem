import React from 'react';
import { ShieldExclamationIcon } from './Icons';

const Forbidden: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-10">
    <ShieldExclamationIcon className="w-16 h-16 text-red-500 mb-4" />
    <h1 className="text-3xl font-bold text-slate-800">403 - Access Denied</h1>
    <p className="text-slate-500 mt-2">You do not have the necessary permissions to view this page. Please contact your system administrator if you believe this is an error.</p>
  </div>
);

export default Forbidden;
