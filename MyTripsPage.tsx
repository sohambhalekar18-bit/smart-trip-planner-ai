
import React from 'react';
import { TripPlan } from '../types';
import { HeartIcon, PlusIcon, EyeIcon, TrashIcon } from './icons';

interface MyTripsPageProps {
  savedTrips: TripPlan[];
  onSelectTrip: (trip: TripPlan) => void;
  onDeleteTrip: (trip: TripPlan) => void;
  onStartPlanning: () => void;
}

const MyTripsPage: React.FC<MyTripsPageProps> = ({ savedTrips, onSelectTrip, onDeleteTrip, onStartPlanning }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Saved Trips</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Here are all the amazing adventures you've planned.</p>
        </div>
        <button
          onClick={onStartPlanning}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-brand-primary hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Plan a New Trip
        </button>
      </div>

      {savedTrips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <HeartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">No Saved Trips Yet</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start planning your next adventure to see your saved itineraries here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedTrips.map((trip, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col group">
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{trip.trip_title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{trip.destination_city}</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 h-16 line-clamp-3">{trip.trip_summary}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <button
                    onClick={() => onSelectTrip(trip)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-primary dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900 rounded-lg transition-colors"
                >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Plan
                </button>
                <button
                    onClick={() => onDeleteTrip(trip)}
                    title="Delete Trip"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
