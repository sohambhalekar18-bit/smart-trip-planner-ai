
import React, { useState, useEffect } from 'react';
import { TripPreferences } from '../types';
import { allDestinations } from '../data/destinations';
import { LocationIcon, CalendarIcon, MoneyBagIcon, DiamondIcon, CrownIcon, SparklesWandIcon } from './icons';

interface TripPlannerFormProps {
  onPlanRequest: (preferences: TripPreferences) => void;
  initialCity?: string;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onPlanRequest, initialCity = '' }) => {
  const [city, setCity] = useState(initialCity);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<'budget' | 'mid-range' | 'luxury'>('mid-range');

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onPlanRequest({ city, days, budget });
    } else {
      alert('Please select a destination.');
    }
  };

  const activeDestinations = allDestinations.filter(d => d.isActive);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-brand-primary to-brand-accent text-white text-center">
            <SparklesWandIcon className="w-12 h-12 mx-auto" />
            <h1 className="text-3xl font-bold mt-2">Plan Your Perfect Trip</h1>
            <p className="text-purple-200 mt-1">Tell us your preferences and we'll create a personalized itinerary.</p>
        </div>
        
        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Destination */}
                <div>
                    <label htmlFor="city" className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        <LocationIcon className="h-6 w-6 mr-2 text-gray-400" />
                        Where do you want to go?
                    </label>
                    <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition appearance-none"
                    >
                        <option value="" disabled>Select a destination</option>
                        {activeDestinations.map(dest => (
                            <option key={dest.city} value={dest.city}>{dest.city}, {dest.country}</option>
                        ))}
                    </select>
                </div>

                {/* Days */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label htmlFor="days" className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                            <CalendarIcon className="h-6 w-6 mr-2 text-gray-400" />
                            How many days?
                        </label>
                        <span className="text-2xl font-bold text-brand-primary">{days} days</span>
                    </div>
                    <input
                        type="range"
                        id="days"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value, 10))}
                        min="1"
                        max="14"
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                    />
                     <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>1 day</span>
                        <span>1 week</span>
                        <span>2 weeks</span>
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                        What's your budget?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <BudgetCard
                            value="budget"
                            title="Budget Friendly"
                            description="Hostels, street food, public transport"
                            icon={<MoneyBagIcon className="w-8 h-8"/>}
                            selectedBudget={budget}
                            onSelect={setBudget}
                        />
                        <BudgetCard
                            value="mid-range"
                            title="Moderate"
                            description="Mid-range hotels, local restaurants"
                            icon={<DiamondIcon className="w-8 h-8"/>}
                            selectedBudget={budget}
                            onSelect={setBudget}
                        />
                        <BudgetCard
                            value="luxury"
                            title="Luxury"
                            description="Premium stays, fine dining"
                            icon={<CrownIcon className="w-8 h-8"/>}
                            selectedBudget={budget}
                            onSelect={setBudget}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full group flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg"
                >
                    <SparklesWandIcon className="w-6 h-6 mr-2" />
                    Generate My Trip Plan
                </button>
            </form>
        </div>
      </div>
      {/* FIX: Removed non-standard 'jsx' and 'global' props from the style tag. This is a styled-jsx syntax which is not compatible with this project's setup and was causing a TypeScript error. */}
      <style>{`
        .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #5B21B6; /* brand-primary */
            cursor: pointer;
            border-radius: 50%;
            border: 4px solid #F5F3FF; /* brand-light */
        }
        .range-thumb::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #5B21B6; /* brand-primary */
            cursor: pointer;
            border-radius: 50%;
            border: 4px solid #F5F3FF; /* brand-light */
        }
      `}</style>
    </div>
  );
};

interface BudgetCardProps {
    value: 'budget' | 'mid-range' | 'luxury';
    title: string;
    description: string;
    icon: React.ReactNode;
    selectedBudget: string;
    onSelect: (value: 'budget' | 'mid-range' | 'luxury') => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ value, title, description, icon, selectedBudget, onSelect }) => {
    const isSelected = selectedBudget === value;
    return (
        <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected 
            ? 'border-brand-primary bg-purple-50 dark:bg-purple-900/30 ring-2 ring-brand-primary' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
        }`}>
            <input 
                type="radio" 
                name="budget" 
                value={value} 
                className="sr-only" 
                checked={isSelected}
                onChange={() => onSelect(value)}
            />
            <div className={`mb-2 ${isSelected ? 'text-brand-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {icon}
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </label>
    );
};


export default TripPlannerForm;
