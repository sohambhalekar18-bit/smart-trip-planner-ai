
import React, { useState, useEffect } from 'react';

const messages = [
  "Crafting your custom itinerary...",
  "Finding hidden gems and local favorites...",
  "Consulting our AI travel experts...",
  "Packing your virtual bags...",
  "Mapping out your daily adventures...",
  "Almost there, your journey awaits!"
];

const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-secondary"></div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6">Generating Your Trip...</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};

export default LoadingSpinner;
