
import React, { useState } from 'react';
import { ArrowRightIcon, SparklesIcon, AdjustmentsHorizontalIcon, HeartIcon, SearchIcon } from './icons';
import DestinationCard from './DestinationCard';
import { allDestinations } from '../data/destinations';

interface HomePageProps {
  onStartPlanning: (city?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartPlanning }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Only show active destinations to the user
  const activeDestinations = allDestinations.filter(d => d.isActive);
  
  const filteredDestinations = activeDestinations.filter(dest => 
    dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-accent text-white">
        <div className="px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your Next Adventure Starts Here</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-purple-200">
            Get personalized travel itineraries with attractions, food, stays, and budget breakdowns – all in one place.
          </p>
          <button onClick={() => onStartPlanning()} className="mt-8 group inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Start Planning
            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 text-center -mt-28 md:-mt-36 px-4 z-10 relative">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <SparklesIcon className="w-10 h-10 mx-auto text-brand-primary"/>
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Smart Itineraries</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">AI-powered day-by-day plans</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <AdjustmentsHorizontalIcon className="w-10 h-10 mx-auto text-brand-primary"/>
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Flexible Planning</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">1-14 days, any budget</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <HeartIcon className="w-10 h-10 mx-auto text-brand-primary"/>
            <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Save Favorites</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Build your travel bucket list</p>
          </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Popular Destinations</h2>
        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">Explore our handpicked destinations with complete travel guides</p>
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400"/>
            </div>
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map(dest => (
                <DestinationCard key={dest.city} {...dest} onSelect={() => onStartPlanning(dest.city)} />
            ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-16 md:py-20 rounded-3xl bg-gradient-to-br from-brand-accent to-brand-primary text-white">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Explore?</h2>
        <p className="mt-3 max-w-xl mx-auto text-purple-200">Create your personalized travel itinerary in seconds</p>
        <button onClick={() => onStartPlanning()} className="mt-8 group inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
          Plan Your Trip Now
          <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </section>
    </div>
  );
};

export default HomePage;
