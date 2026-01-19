
import React from 'react';
import { PlaneIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <PlaneIcon className="h-8 w-8 text-brand-secondary" />
              <h2 className="text-2xl font-bold text-white">Smart Trip Planner</h2>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Plan your next trip with AI-powered itineraries, local recommendations, and personalized travel guides.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plan Trip</a></li>
              <li><a href="#" className="hover:text-white transition-colors">My Trips</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Smart Itineraries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Budget Planner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Food Recommendations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Packing Lists</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Smart Trip Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
