
import React from 'react';
import { WarningIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto my-10 text-center p-8 bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-900 rounded-lg shadow-lg animate-fade-in">
      <WarningIcon className="w-12 h-12 mx-auto text-red-500" />
      <h3 className="mt-4 text-2xl font-bold text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
      <p className="mt-2 text-red-600 dark:text-red-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;
