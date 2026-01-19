
import React, { useState, useCallback, useEffect } from 'react';
import { TripPlan, TripPreferences, User } from './types';
import { generateTripPlan } from './services/geminiService';
import HomePage from './components/HomePage';
import TripPlannerForm from './components/TripPlannerForm';
import TripPlanDisplay from './components/TripPlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorDisplay from './components/ErrorDisplay';
import LoginPage, { LoginCredentials } from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import SignUpPage, { SignUpData } from './components/SignUpPage';
import MyTripsPage from './components/MyTripsPage';

type View = 'user' | 'admin';
type Theme = 'light' | 'dark';
type AuthView = 'login' | 'signup';
type UserPage = 'home' | 'planning' | 'plan-display' | 'my-trips';

const App: React.FC = () => {
  // --- LocalStorage Keys ---
  const USERS_KEY = 'trip_planner_users';
  const ALL_TRIPS_KEY = 'trip_planner_all_trips';
  const SAVED_TRIPS_KEY = 'trip_planner_saved_trips';
  const SESSION_KEY = 'trip_planner_session';

  // --- State Initialization ---
  const [users, setUsers] = useState<User[]>([]);
  const [userGeneratedContent, setUserGeneratedContent] = useState<TripPlan[]>([]);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentView, setCurrentView] = useState<View>('user');
  const [userPage, setUserPage] = useState<UserPage>('home');
  const [theme, setTheme] = useState<Theme>('light');
  const [authView, setAuthView] = useState<AuthView>('login');

  const [initialCity, setInitialCity] = useState('');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- Effects for Persistence ---
  useEffect(() => {
    // Load data from localStorage on initial mount
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (storedUsers.length === 0) {
      // First time load: create demo users
      const demoUsers: User[] = [
        { id: 1, name: 'Admin', email: 'admin@example.com', password: 'admin', role: 'admin', status: 'Active' },
        { id: 2, name: 'User', email: 'user@example.com', password: 'user', role: 'user', status: 'Active' },
      ];
      setUsers(demoUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    } else {
      setUsers(storedUsers);
    }

    setUserGeneratedContent(JSON.parse(localStorage.getItem(ALL_TRIPS_KEY) || '[]'));
    
    // Check for an active session
    const sessionUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (sessionUser) {
      setCurrentUser(sessionUser);
      setSavedTrips(JSON.parse(localStorage.getItem(`${SAVED_TRIPS_KEY}_${sessionUser.id}`) || '[]'));
    }

    // Theme setup
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  }, []);

  useEffect(() => { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(ALL_TRIPS_KEY, JSON.stringify(userGeneratedContent)); }, [userGeneratedContent]);
  useEffect(() => { if(currentUser) localStorage.setItem(`${SAVED_TRIPS_KEY}_${currentUser.id}`, JSON.stringify(savedTrips)); }, [savedTrips, currentUser]);
  useEffect(() => { localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser)); }, [currentUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // --- Auth Handlers ---
  const handleLogin = useCallback((creds: LoginCredentials) => {
    const user = users.find(u => u.email.toLowerCase() === creds.email.toLowerCase() && u.password === creds.password);
    if (user) {
      if (user.status === 'Blocked') {
          alert('Your account has been blocked. Please contact an administrator.');
          return;
      }
      setCurrentUser(user);
      setCurrentView(user.role);
      setSavedTrips(JSON.parse(localStorage.getItem(`${SAVED_TRIPS_KEY}_${user.id}`) || '[]'));
    } else {
      alert('Invalid email or password.');
    }
  }, [users]);
  
  const handleSignUp = useCallback((data: SignUpData) => {
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        alert('An account with this email already exists.');
        return;
    }
    const newUser: User = {
        id: Date.now(),
        ...data,
        role: 'user',
        status: 'Active',
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('user');
    setSavedTrips([]); // New user has no saved trips
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setAuthView('login');
    setUserPage('home');
    setTripPlan(null);
    setSavedTrips([]);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  // --- Navigation & Core App Logic Handlers ---
  const handleStartPlanning = useCallback((city: string = '') => {
    setUserPage('planning');
    setInitialCity(city);
    setTripPlan(null);
    setError(null);
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoToMyTrips = useCallback(() => {
    setUserPage('my-trips');
    setTripPlan(null);
    setError(null);
  }, []);
  
  const handleViewSavedTrip = useCallback((trip: TripPlan) => {
    setTripPlan(trip);
    setUserPage('plan-display');
    window.scrollTo(0, 0);
  }, []);

  const handleSaveTrip = useCallback((plan: TripPlan) => {
    setSavedTrips(prev => (prev.some(t => t.trip_title === plan.trip_title) ? prev : [...prev, plan]));
  }, []);
  
  const handleDeleteSavedTrip = useCallback((planToDelete: TripPlan) => {
    setSavedTrips(prev => prev.filter(p => p.trip_title !== planToDelete.trip_title));
    if (tripPlan?.trip_title === planToDelete.trip_title) {
        setTripPlan(null);
        setUserPage('my-trips');
    }
  }, [tripPlan]);
  
  const handleDeleteTripAdmin = useCallback((planToDelete: TripPlan) => {
    setUserGeneratedContent(prev => prev.filter(p => p.trip_title !== planToDelete.trip_title));
    setSavedTrips(prev => prev.filter(p => p.trip_title !== planToDelete.trip_title)); // Also remove from saved if present
  }, []);

  const handlePlanRequest = useCallback(async (preferences: TripPreferences) => {
    setIsLoading(true);
    setError(null);
    setTripPlan(null);
    try {
      const plan = await generateTripPlan(preferences);
      const planWithUser = { ...plan, createdBy: currentUser?.name || 'Unknown User' };
      setTripPlan(planWithUser);
      setUserGeneratedContent(prev => [...prev, planWithUser]);
      setUserPage('plan-display');
    } catch (err) {
      console.error(err);
      setError('Failed to generate trip plan. The model may be overloaded. Please try again.');
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  }, [currentUser]);
  
  const handleReset = useCallback(() => {
    setTripPlan(null);
    setError(null);
    setIsLoading(false);
    setUserPage('home');
    setInitialCity('');
    window.scrollTo(0, 0);
  }, []);

  const handleBackToPlanner = useCallback(() => {
    setError(null);
    setUserPage('planning');
  }, []);
  
  // --- Admin User Management Handlers ---
  const handleUpdateUsers = (updatedUsers: User[]) => {
      setUsers(updatedUsers);
  };

  // --- Render Logic ---
  if (!currentUser) {
    return authView === 'login' 
      ? <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setAuthView('signup')} />
      : <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={() => setAuthView('login')} />;
  }

  if (currentView === 'admin' && currentUser.role === 'admin') {
    return <AdminDashboard 
        onBackToApp={() => setCurrentView('user')} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        allTrips={userGeneratedContent} 
        onDeleteTrip={handleDeleteTripAdmin}
        users={users}
        onUpdateUsers={handleUpdateUsers}
        savedTripsCount={savedTrips.length}
    />;
  }

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} onRetry={handleBackToPlanner} />;
    
    switch(userPage) {
        case 'home': return <HomePage onStartPlanning={handleStartPlanning} />;
        case 'planning': return <TripPlannerForm initialCity={initialCity} onPlanRequest={handlePlanRequest} />;
        case 'plan-display':
            if (tripPlan) {
              return <TripPlanDisplay tripPlan={tripPlan} onReset={handleReset} onSaveTrip={handleSaveTrip} isSaved={savedTrips.some(t => t.trip_title === tripPlan.trip_title)} />;
            }
            return <HomePage onStartPlanning={handleStartPlanning} />;
        case 'my-trips':
            return <MyTripsPage savedTrips={savedTrips} onSelectTrip={handleViewSavedTrip} onDeleteTrip={handleDeleteSavedTrip} onStartPlanning={handleStartPlanning}/>;
        default:
            return <HomePage onStartPlanning={handleStartPlanning} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header 
        onGoHome={handleReset} 
        onStartPlanning={() => handleStartPlanning()}
        onGoToMyTrips={handleGoToMyTrips}
        onLogout={handleLogout}
        userRole={currentUser.role}
        onGoToAdmin={() => setCurrentView('admin')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
        {renderContent()}
      </main>
      {userPage === 'home' && <Footer />}
    </div>
  );
};

export default App;