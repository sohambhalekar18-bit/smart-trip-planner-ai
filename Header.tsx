
import React from 'react';
import { PlaneIcon, LogoutIcon, ShieldCheckIcon, HeartIcon } from './icons';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onGoHome: () => void;
  onStartPlanning: () => void;
  onGoToMyTrips: () => void;
  onLogout: () => void;
  userRole: 'admin' | 'user' | null;
  onGoToAdmin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onStartPlanning, onGoToMyTrips, onLogout, userRole, onGoToAdmin, theme, onToggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <button onClick={onGoHome} className="flex items-center space-x-2">
          <PlaneIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
            TripPlanner
          </h1>
        </button>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" onClick={(e) => { e.preventDefault(); onGoHome(); }} className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors">Destinations</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onStartPlanning(); }} className="text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors">Plan Trip</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onGoToMyTrips(); }} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-white transition-colors">
            <HeartIcon className="w-5 h-5 mr-1.5" />
            My Trips
          </a>
        </nav>

        <div className="flex items-center space-x-4">
           <ThemeToggle theme={theme} onToggle={onToggleTheme} />
           {userRole === 'admin' && (
             <button onClick={onGoToAdmin} title="Admin Panel" className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900 group transition-colors">
                <ShieldCheckIcon className="h-6 w-6 text-brand-primary dark:text-purple-300"/>
             </button>
           )}
           <button onClick={onLogout} title="Logout" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/50 group transition-colors">
            <LogoutIcon className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
