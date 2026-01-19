
import React from 'react';

interface MapModalProps {
  url: string;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ url, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location Map</h2>
          <button 
            onClick={onClose} 
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-md text-sm transition"
            aria-label="Close map"
          >
            &times;
          </button>
        </div>
        <div className="flex-grow p-1">
          <iframe
            src={url}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
            className="rounded-b-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapModal;