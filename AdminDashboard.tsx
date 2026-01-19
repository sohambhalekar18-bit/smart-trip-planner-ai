
import React, { useState, useCallback, FormEvent } from 'react';
import { allDestinations as initialDestinations } from '../data/destinations';
import {
  GlobeAltIcon,
  PlaneIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  SearchIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
} from './icons';
import ThemeToggle from './ThemeToggle';
import { TripPlan, User } from '../types';

// --- Types ---
interface Destination {
  city: string;
  country: string;
  image: string;
  bestTime: string;
  description: string;
  tags: string[];
  isActive: boolean;
}

interface AdminDashboardProps {
  onBackToApp: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  allTrips: TripPlan[];
  onDeleteTrip: (trip: TripPlan) => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  savedTripsCount: number;
}

type Tab = 'cities' | 'trips' | 'users';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBackToApp, theme, onToggleTheme, allTrips, onDeleteTrip, users, onUpdateUsers, savedTripsCount 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('trips');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cities, setCities] = useState<Destination[]>(initialDestinations);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<Destination | null>(null);
  const [viewingTrip, setViewingTrip] = useState<TripPlan | null>(null);

  const filteredCities = cities.filter(
    (dest) =>
      dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrips = allTrips.filter(
      (trip) => trip.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) || (trip.createdBy || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- City Management ---
  const handleOpenCityModal = (city: Destination | null = null) => { setEditingCity(city); setIsCityModalOpen(true); };
  const handleCloseCityModal = () => { setIsCityModalOpen(false); setEditingCity(null); };
  const handleSaveCity = (cityData: Destination) => {
    if (editingCity && cities.some(c => c.city === editingCity.city)) {
      setCities(cities.map(c => c.city === editingCity.city ? cityData : c));
    } else {
      if (cities.some(c => c.city.toLowerCase() === cityData.city.toLowerCase())) { alert('A city with this name already exists.'); return; }
      setCities([cityData, ...cities]);
    }
    handleCloseCityModal();
  };
  const handleDeleteCity = useCallback((cityNameToDelete: string) => { if (window.confirm(`Are you sure you want to delete ${cityNameToDelete}?`)) { setCities(c => c.filter(city => city.city !== cityNameToDelete)); } }, []);
  const handleToggleCityStatus = useCallback((cityName: string) => { setCities(c => c.map(city => city.city === cityName ? { ...city, isActive: !city.isActive } : city)); }, []);

  // --- User Management Handlers ---
  const handleDeleteUser = useCallback((userId: number) => {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          onUpdateUsers(users.filter(u => u.id !== userId));
      }
  }, [users, onUpdateUsers]);

  const handleToggleUserStatus = useCallback((userId: number) => {
      onUpdateUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
  }, [users, onUpdateUsers]);

  const handleDeleteTripAdmin = (trip: TripPlan) => {
    if (window.confirm(`Are you sure you want to delete the trip to ${trip.destination_city}? This will remove it for all users.`)) {
        onDeleteTrip(trip);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-admin-bg text-gray-200 font-sans">
        <header className="bg-admin-card p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Manage cities, trips, and users</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button onClick={onBackToApp} className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition">
              <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to App
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Cities" value={cities.length} icon={<GlobeAltIcon />} color="blue" />
            <StatCard title="Generated Trips" value={allTrips.length} icon={<PlaneIcon />} color="green" />
            <StatCard title="Total Users" value={users.length} icon={<UsersIcon />} color="purple" />
            <StatCard title="Saved Trips" value={savedTripsCount} icon={<ChartBarIcon />} color="yellow" />
          </section>

          <section>
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <TabButton name="Trips" icon={<PlaneIcon />} isActive={activeTab === 'trips'} onClick={() => { setActiveTab('trips'); setSearchTerm(''); }} />
                <TabButton name="Users" icon={<UsersIcon />} isActive={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSearchTerm(''); }} />
                <TabButton name="Cities" icon={<GlobeAltIcon />} isActive={activeTab === 'cities'} onClick={() => { setActiveTab('cities'); setSearchTerm(''); }} />
              </nav>
            </div>
          </section>
          
          <section className="bg-admin-card p-6 rounded-lg shadow-lg">
            {activeTab === 'trips' && (
                <ManagementPanel title="All Generated Trips" searchPlaceholder="Search by destination or user..." addText="" searchTerm={searchTerm} onSearchChange={setSearchTerm}>
                    <div className="space-y-2 mt-4">
                        {filteredTrips.length > 0 ? filteredTrips.map(trip => (
                            <TripRow key={trip.trip_title} trip={trip} onView={() => setViewingTrip(trip)} onDelete={() => handleDeleteTripAdmin(trip)} />
                        )) : <p className="text-center text-gray-400 py-8">No trips have been generated by users yet.</p>}
                    </div>
                </ManagementPanel>
            )}
             {activeTab === 'users' && (
               <ManagementPanel title="Manage Users" searchPlaceholder="Search users..." addText="" searchTerm={searchTerm} onSearchChange={setSearchTerm}>
                 <div className="space-y-2 mt-4">
                   {filteredUsers.map(user => (
                     <UserRow key={user.id} user={user} onDelete={() => handleDeleteUser(user.id)} onToggleStatus={() => handleToggleUserStatus(user.id)} />
                   ))}
                 </div>
               </ManagementPanel>
            )}
            {activeTab === 'cities' && (
              <ManagementPanel title="Manage Cities" searchPlaceholder="Search cities..." onAdd={() => handleOpenCityModal()} addText="Add City" searchTerm={searchTerm} onSearchChange={setSearchTerm}>
                <div className="space-y-2 mt-4">
                  {filteredCities.map(dest => (
                    <CityRow key={dest.city} city={dest} onEdit={() => handleOpenCityModal(dest)} onDelete={() => handleDeleteCity(dest.city)} onToggleStatus={() => handleToggleCityStatus(dest.city)} />
                  ))}
                </div>
              </ManagementPanel>
            )}
          </section>
        </main>
      </div>
      {isCityModalOpen && <CityModal city={editingCity} onSave={handleSaveCity} onClose={handleCloseCityModal} />}
      {viewingTrip && <TripViewModal trip={viewingTrip} onClose={() => setViewingTrip(null)} />}
    </>
  );
};

// --- Sub-components ---
const TripRow: React.FC<{ trip: TripPlan, onView: () => void, onDelete: () => void }> = ({ trip, onView, onDelete }) => (
    <div className="p-3 rounded-lg flex items-center justify-between transition bg-slate-800/50 hover:bg-slate-700/50">
        <div>
            <p className="font-semibold text-white">{trip.destination_city}</p>
            <p className="text-xs text-gray-400">by {trip.createdBy || 'Unknown'}</p> 
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{trip.itinerary.length} Days</span>
            <div className="flex items-center space-x-2 text-gray-400">
                <button onClick={onView} className="p-2 hover:bg-slate-600 rounded-md" title="View Details"><EyeIcon className="w-4 h-4"/></button>
                <button onClick={onDelete} className="p-2 hover:bg-slate-600 rounded-md text-red-400/80 hover:text-red-400" title="Delete"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
    </div>
);

const TripViewModal: React.FC<{ trip: TripPlan, onClose: () => void }> = ({ trip, onClose }) => {
    
    const getPlaceholderImage = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('hotel') || lowerType.includes('accommodation') || lowerType.includes('hostel')) {
            return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';
        }
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=60';
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
             <div 
                className="bg-admin-card rounded-lg shadow-xl w-full max-w-5xl h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">Trip Plan: {trip.destination_city}</h2>
                    <button onClick={onClose} className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded-md text-sm transition">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 text-gray-300">
                    {/* Header */}
                    <header className="text-center p-4 bg-slate-800 rounded-lg">
                        <h1 className="text-3xl font-bold text-brand-secondary">{trip.trip_title}</h1>
                        <p className="text-md text-gray-300 mt-1">{trip.destination_city} by {trip.createdBy}</p>
                        <p className="mt-3 text-sm text-gray-400 max-w-3xl mx-auto">{trip.trip_summary}</p>
                    </header>

                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">Itinerary</h2>
                        <div className="space-y-4">
                            {trip.itinerary.map(day => (
                                <div key={day.day} className="bg-slate-800/50 rounded-lg overflow-hidden">
                                    <div className="p-3 bg-slate-700/50">
                                        <h3 className="text-lg font-bold text-white">Day {day.day}: {day.theme}</h3>
                                    </div>
                                    <div className="p-4 grid gap-4">
                                        {day.items.map((item, index) => (
                                            <div key={index} className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-3 rounded-md">
                                                <img 
                                                    src={item.image_url} 
                                                    alt={item.activity}
                                                    className="w-full md:w-48 h-32 object-cover rounded flex-shrink-0"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562979314-1906a282ca83?auto=format&fit=crop&w=800&q=60'; }}
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-white">{item.time}: {item.activity}</h4>
                                                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Recommendations */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Food */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-white">Food Recommendations</h2>
                            <ul className="space-y-3">
                                {trip.food_recommendations.map(item => (
                                    <li key={item.name} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-md">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                                            onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholderImage(item.type); }}
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white">{item.name} <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full ml-1">{item.type}</span></h4>
                                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        {/* Accommodation */}
                        <section>
                             <h2 className="text-2xl font-bold mb-4 text-white">Accommodation</h2>
                             <ul className="space-y-3">
                                {trip.accommodation_suggestions.map(item => (
                                    <li key={item.name} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-md">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                                            onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholderImage(item.type); }}
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white">{item.name} <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full ml-1">{item.type}</span></h4>
                                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
             </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => {
    const colors: { [key: string]: string } = { blue: 'bg-blue-500/20 text-blue-400', green: 'bg-green-500/20 text-green-400', purple: 'bg-purple-500/20 text-purple-400', yellow: 'bg-yellow-500/20 text-yellow-400' };
    return ( <div className="bg-admin-card p-5 rounded-lg shadow flex justify-between items-center"> <div> <p className="text-sm text-gray-400">{title}</p> <p className="text-3xl font-bold text-white mt-1">{value}</p> </div> <div className={`p-3 rounded-lg ${colors[color]}`}>{React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}</div> </div> );
};

const TabButton: React.FC<{name: string, icon: React.ReactNode, isActive: boolean, onClick: () => void}> = ({ name, icon, isActive, onClick }) => {
    return ( <button onClick={onClick} className={`flex items-center px-3 py-2 text-sm font-medium rounded-t-md transition ${ isActive ? 'bg-admin-bg text-white' : 'text-gray-400 hover:text-white' }`} > {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5 mr-2' })} {name} </button> );
};

interface ManagementPanelProps { title: string; searchPlaceholder: string; addText: string; onAdd?: () => void; searchTerm: string; onSearchChange: (value: string) => void; children: React.ReactNode; }

const ManagementPanel: React.FC<ManagementPanelProps> = ({ title, searchPlaceholder, addText, onAdd, searchTerm, onSearchChange, children }) => (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="bg-slate-800 border border-slate-600 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {onAdd && ( <button onClick={onAdd} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition"> <PlusIcon className="w-4 h-4 mr-2"/> {addText} </button> )}
            </div>
        </div>
        {children}
    </div>
);

const CityRow: React.FC<{ city: Destination, onEdit: () => void, onDelete: () => void, onToggleStatus: () => void }> = ({ city, onEdit, onDelete, onToggleStatus }) => (
    <div className={`p-3 rounded-lg flex items-center justify-between transition ${city.isActive ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-900/50 hover:bg-slate-800/50 opacity-60'}`}>
        <div className="flex items-center">
            <img src={city.image} alt={city.city} className="w-14 h-10 object-cover rounded-md mr-4"/>
            <div> <p className="font-semibold text-white">{city.city}</p> <p className="text-xs text-gray-400">{city.country}</p> </div>
        </div>
        <div className="flex items-center space-x-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${city.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}> {city.isActive ? 'Active' : 'Inactive'} </span>
            <div className="flex items-center space-x-2 text-gray-400">
                <button onClick={onToggleStatus} className="p-2 hover:bg-slate-600 rounded-md" title={city.isActive ? 'Deactivate' : 'Activate'}>{city.isActive ? <EyeIcon className="w-4 h-4"/> : <EyeSlashIcon className="w-4 h-4"/>}</button>
                <button onClick={onEdit} className="p-2 hover:bg-slate-600 rounded-md" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                <button onClick={onDelete} className="p-2 hover:bg-slate-600 rounded-md text-red-400/80 hover:text-red-400" title="Delete"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
    </div>
);

const UserRow: React.FC<{ user: User, onDelete: () => void, onToggleStatus: () => void }> = ({ user, onDelete, onToggleStatus }) => (
    <div className={`p-3 rounded-lg flex items-center justify-between transition ${user.status === 'Active' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-900/50 hover:bg-slate-800/50 opacity-60'}`}>
        <div> <p className="font-semibold text-white">{user.name}</p> <p className="text-xs text-gray-400">{user.email}</p> </div>
        <div className="flex items-center space-x-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}> {user.status} </span>
            <div className="flex items-center space-x-2 text-gray-400">
                <button onClick={onToggleStatus} className="p-2 hover:bg-slate-600 rounded-md" title={user.status === 'Active' ? 'Block' : 'Unblock'}>{user.status === 'Active' ? <EyeSlashIcon className="w-4 h-4"/> : <EyeIcon className="w-4 h-4"/>}</button>
                <button onClick={onDelete} className="p-2 hover:bg-slate-600 rounded-md text-red-400/80 hover:text-red-400" title="Delete"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
    </div>
);

const CityModal: React.FC<{ city: Destination | null, onSave: (data: Destination) => void, onClose: () => void }> = ({ city, onSave, onClose }) => {
    const [formData, setFormData] = useState<Destination>(city || { city: '', country: '', image: '', bestTime: '', description: '', tags: [], isActive: true });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim())})); };
    const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSave(formData); };
    return ( <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"> <div className="bg-admin-card rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto"> <form onSubmit={handleSubmit}> <div className="p-6"> <h2 className="text-xl font-semibold text-white">{city ? 'Edit City' : 'Add New City'}</h2> </div> <div className="p-6 space-y-4 border-y border-slate-700"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <FormInput name="city" label="City Name" value={formData.city} onChange={handleChange} required disabled={!!city} /> <FormInput name="country" label="Country" value={formData.country} onChange={handleChange} required /> </div> <FormInput name="image" label="Image URL" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." required /> <FormInput name="bestTime" label="Best Time to Visit" value={formData.bestTime} onChange={handleChange} placeholder="e.g., Nov-Feb" required /> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Description</label> <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required /> </div> <FormInput name="tags" label="Tags (comma separated)" value={formData.tags.join(', ')} onChange={handleTagsChange} placeholder="e.g., Beaches, Nightlife, History" /> </div> <div className="p-4 flex justify-end items-center space-x-3 bg-slate-800/50 rounded-b-lg"> <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md text-sm font-medium transition">Cancel</button> <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition">Save City</button> </div> </form> </div> </div> );
};

const FormInput: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, disabled?: boolean, placeholder?: string}> = ({name, label, value, onChange, required=false, disabled=false, placeholder}) => (
    <div> <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label> <input type="text" id={name} name={name} value={value} onChange={onChange} required={required} disabled={disabled} placeholder={placeholder} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" /> </div>
);

export default AdminDashboard;
