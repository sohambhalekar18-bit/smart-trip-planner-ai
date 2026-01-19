
import React from 'react';

interface DestinationCardProps {
  city: string;
  country: string;
  image: string;
  bestTime: string;
  description: string;
  tags: string[];
  onSelect: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, country, image, bestTime, description, tags, onSelect }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 group"
      onClick={onSelect}
    >
      <div className="relative">
        <img src={image} alt={`Image of ${city}`} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">{bestTime}</div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{city}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{country}</p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 h-10">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
