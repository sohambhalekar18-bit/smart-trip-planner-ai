
import React, { useState } from 'react';
import { TripPlan, ItineraryDay, Recommendation } from '../types';
import { CalendarIcon, FoodIcon, HotelIcon, TransportIcon, MoneyIcon, PinIcon, CheckIcon, SunIcon, ShieldIcon, HeartIcon, PlusIcon, WhatsAppIcon } from './icons';
import MapModal from './MapModal';

interface TripPlanDisplayProps {
  tripPlan: TripPlan;
  onReset: () => void;
  onSaveTrip: (plan: TripPlan) => void;
  isSaved: boolean;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ tripPlan, onReset, onSaveTrip, isSaved }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>(isSaved ? 'saved' : 'idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  const handleSave = () => {
    onSaveTrip(tripPlan);
    setSaveStatus('saved');
  };

  const handleDownload = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Trip to ${tripPlan.destination_city}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 20px auto; padding: 20px; }
          h1, h2, h3 { color: #5B21B6; }
          h1 { text-align: center; }
          .section { margin-bottom: 2rem; }
          .day { border-left: 3px solid #D946EF; padding-left: 1rem; margin-bottom: 1.5rem; }
          strong { font-weight: bold; }
          ul { padding-left: 20px; }
          li { margin-bottom: 5px; }
          img { max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${tripPlan.trip_title}</h1>
        <p style="text-align: center;"><em>${tripPlan.trip_summary}</em></p>
        
        <div class="section">
          <h2>Itinerary</h2>
          ${tripPlan.itinerary.map(day => `
            <div class="day">
              <h3>Day ${day.day}: ${day.theme}</h3>
              ${day.items.map(item => `
                <div>
                  <h4>${item.time}: ${item.activity}</h4>
                  <p>${item.description}</p>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        
        <div class="section">
            <h2>Food Recommendations</h2>
            ${tripPlan.food_recommendations.map(r => `<p><strong>${r.name} (${r.type}):</strong> ${r.description}</p>`).join('')}
        </div>

        <div class="section">
            <h2>Accommodation Suggestions</h2>
            ${tripPlan.accommodation_suggestions.map(r => `<p><strong>${r.name} (${r.type}):</strong> ${r.description}</p>`).join('')}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trip-to-${tripPlan.destination_city}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleShare = () => {
    const shareText = `Check out my trip to ${tripPlan.destination_city}!\n\n✨ ${tripPlan.trip_title}\n\n${tripPlan.trip_summary}`;
    navigator.clipboard.writeText(shareText).then(() => {
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
    });
  };

  const handleShareToWhatsApp = () => {
    const { trip_title, destination_city, trip_summary, itinerary } = tripPlan;

    // Helper to format text for WhatsApp (bold, italic) and sanitize
    const format = (text: string) => text.replace(/[*_~`]/g, '').trim();

    let text = `*Check out my trip to ${format(destination_city)}!* ✈️\n\n`;
    text += `*${format(trip_title)}*\n\n`;
    text += `_${format(trip_summary)}_\n\n`;
    text += `*Itinerary Highlights:*\n`;

    itinerary.forEach(day => {
        text += `\n*Day ${day.day}: ${format(day.theme)}*\n`;
        // Limit to 3 items per day to keep the message concise for WhatsApp
        day.items.slice(0, 3).forEach(item => {
            text += `- ${format(item.activity)}\n`;
        });
    });

    text += `\n_Planned with the Smart Trip Planner AI_`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {mapUrl && <MapModal url={mapUrl} onClose={() => setMapUrl(null)} />}
      <div className="animate-fade-in space-y-8">
        <header className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-slide-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-brand-secondary">{tripPlan.trip_title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{tripPlan.destination_city}</p>
          <p className="mt-4 max-w-3xl mx-auto text-gray-700 dark:text-gray-400">{tripPlan.trip_summary}</p>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saved'}
                  className={`inline-flex items-center px-6 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
                      saveStatus === 'saved'
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
              >
                  <HeartIcon className="w-5 h-5 mr-2" />
                  {saveStatus === 'saved' ? 'Saved to My Trips' : 'Save Trip'}
              </button>
              <button onClick={handleDownload} className="inline-flex items-center px-6 py-2 rounded-full font-semibold text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors duration-300">
                  Download Plan
              </button>
              <button onClick={handleShareToWhatsApp} className="inline-flex items-center px-6 py-2 rounded-full font-semibold text-sm bg-green-100 hover:bg-green-200 text-green-800 transition-colors duration-300">
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Share on WhatsApp
              </button>
              <button onClick={handleShare} className="inline-flex items-center px-6 py-2 rounded-full font-semibold text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors duration-300">
                  {shareStatus === 'copied' ? 'Copied!' : 'Copy Summary'}
              </button>
          </div>
        </header>

        {/* Itinerary Section */}
        <section className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="flex items-center text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200"><CalendarIcon className="w-8 h-8 mr-3 text-brand-secondary"/>Itinerary</h2>
          <div className="space-y-6">
            {tripPlan.itinerary.map((day) => <DayCard key={day.day} day={day} onMapViewClick={setMapUrl} />)}
          </div>
        </section>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Food Recommendations */}
          <InfoCard title="Food Recommendations" icon={<FoodIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="200ms">
              <ul className="space-y-4">
              {tripPlan.food_recommendations.map(item => (
                  <RecommendationItem key={item.name} item={item} />
              ))}
              </ul>
          </InfoCard>

          {/* Accommodation Suggestions */}
          <InfoCard title="Accommodation" icon={<HotelIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="300ms">
              <ul className="space-y-4">
              {tripPlan.accommodation_suggestions.map(item => (
                  <RecommendationItem key={item.name} item={item} />
              ))}
              </ul>
          </InfoCard>

          {/* Transportation */}
          <InfoCard title="Transportation" icon={<TransportIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="400ms">
              <p className="text-gray-700 dark:text-gray-300">{tripPlan.transportation_info}</p>
          </InfoCard>
          
          {/* Budget Breakdown */}
          <InfoCard title="Budget Breakdown" icon={<MoneyIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="500ms">
              <ul className="space-y-2">
              {tripPlan.budget_breakdown.map(item => (
                  <li key={item.item} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                      <span>{item.item}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{item.cost}</span>
                  </li>
              ))}
              </ul>
          </InfoCard>

          {/* Best Time to Visit */}
          <InfoCard title="Best Time to Visit" icon={<SunIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="600ms">
              <p className="text-gray-700 dark:text-gray-300">{tripPlan.best_time_to_visit}</p>
          </InfoCard>

          {/* Safety Tips */}
          <InfoCard title="Safety Tips" icon={<ShieldIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="700ms">
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {tripPlan.safety_tips.map((tip, index) => <li key={index}>{tip}</li>)}
              </ul>
          </InfoCard>
        </div>
        
          {/* Packing Checklist */}
        <InfoCard title="Packing Checklist" icon={<CheckIcon className="w-7 h-7 mr-3 text-brand-secondary"/>} delay="800ms">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-gray-700 dark:text-gray-300">
            {tripPlan.packing_checklist.map((item, index) => <li key={index} className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-500"/>{item}</li>)}
          </ul>
        </InfoCard>

        <div className="text-center pt-8">
          <button onClick={onReset} className="bg-brand-secondary hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md inline-flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Another Trip
          </button>
        </div>
      </div>
    </>
  );
};

const DayCard: React.FC<{ day: ItineraryDay; onMapViewClick: (url: string) => void }> = ({ day, onMapViewClick }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <div className="bg-brand-light dark:bg-brand-dark p-4">
      <h3 className="text-xl font-bold text-brand-primary dark:text-white">Day {day.day}: <span className="font-normal">{day.theme}</span></h3>
    </div>
    <div className="p-4 md:p-6 grid gap-6">
      {day.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-sm">
          <img 
            src={item.image_url} 
            alt={item.activity} 
            className="w-full sm:w-1/3 h-40 sm:h-auto object-cover"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1562979314-1906a282ca83?auto=format&fit=crop&w=800&q=60'; }}
          />
          <div className="p-4 flex-grow">
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{item.time}: {item.activity}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{item.description}</p>
            <button 
              onClick={() => onMapViewClick(item.gmaps_embed_url)}
              className="inline-flex items-center text-sm text-brand-secondary hover:underline mt-2"
            >
              <PinIcon className="w-4 h-4 mr-1" /> View on Map
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecommendationItem: React.FC<{ item: Recommendation }> = ({ item }) => {
    const getPlaceholderImage = () => {
        const type = item.type.toLowerCase();
        if (type.includes('hotel') || type.includes('accommodation') || type.includes('hostel')) {
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';
        }
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60';
    };

    return (
        <li className="flex items-start gap-4">
            <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0" 
                onError={(e) => { e.currentTarget.src = getPlaceholderImage(); }} 
            />
            <div className="flex-grow">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{item.name} 
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full ml-2 align-middle">{item.type}</span>
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
            </div>
        </li>
    );
};

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; delay?: string; children: React.ReactNode }> = ({ title, icon, delay, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-slide-in-up" style={{ animationDelay: delay }}>
        <h3 className="flex items-center text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{icon}{title}</h3>
        <div className="text-gray-600 dark:text-gray-300">
            {children}
        </div>
    </div>
);


export default TripPlanDisplay;
