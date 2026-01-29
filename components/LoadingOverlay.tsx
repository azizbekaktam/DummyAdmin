import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGlobal } from '../store/GlobalContext';

const LoadingOverlay: React.FC = () => {
  const { state } = useGlobal();

  if (!state.isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="text-gray-700 font-medium">Loading data...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
