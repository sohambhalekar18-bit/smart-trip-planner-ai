
import React, { useState } from 'react';
import { PlaneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, GoogleIcon, EnvelopeIcon } from './icons';

export interface LoginCredentials {
  email: string;
  password?: string;
}

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password });
    }
  };

  const handleDemoLogin = (role: 'admin' | 'user') => {
    const creds = role === 'admin' 
        ? { email: 'admin@example.com', password: 'admin' }
        : { email: 'user@example.com', password: 'user' };
    
    setEmail(creds.email);
    setPassword(creds.password);
    // Use a timeout to allow state to update before logging in for visual feedback
    setTimeout(() => onLogin(creds), 100);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-login-bg-start to-login-bg-end text-white flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 rounded-2xl mb-4 shadow-lg">
             <PlaneIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Smart Trip Planner</h1>
          <p className="text-white/70 mt-1">AI-Powered Travel Companion</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-center">Sign In</h2>
          <p className="text-center text-white/60 mt-2 text-sm">Enter your credentials to access your trips</p>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition mt-8">
            <GoogleIcon className="w-5 h-5"/>
            Continue with Google
          </button>
          
          <div className="flex items-center gap-3 my-6">
            <hr className="w-full border-t border-white/20"/>
            <span className="text-white/60 text-sm">OR</span>
            <hr className="w-full border-t border-white/20"/>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80">Email</label>
              <div className="relative mt-2">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border-2 border-transparent focus:border-white/30 rounded-lg pl-12 pr-4 py-3 placeholder:text-white/40 focus:ring-0 focus:outline-none transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative mt-2">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/10 border-2 border-transparent focus:border-white/30 rounded-lg pl-12 pr-12 py-3 placeholder:text-white/40 focus:ring-0 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 hover:text-white transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-bold py-3.5 rounded-lg shadow-lg transform active:scale-95 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 text-center">
              <p className="text-sm text-white/50 uppercase tracking-widest">Demo Credentials</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                  <button 
                      onClick={() => handleDemoLogin('admin')}
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
                  >
                      <p className="font-semibold">Admin</p>
                      <p className="text-xs text-white/50">admin@example.com</p>
                  </button>
                  <button
                      onClick={() => handleDemoLogin('user')}
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
                  >
                      <p className="font-semibold">User</p>
                      <p className="text-xs text-white/50">user@example.com</p>
                  </button>
              </div>
          </div>
          
            <p className="text-center mt-6 text-sm text-white/60">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }} className="font-semibold hover:text-white">Create an account</a>
            </p>
        </div>
      </div>

      <p className="absolute bottom-4 text-center text-sm text-white/50">&copy; {new Date().getFullYear()} Smart Trip Planner</p>
    </div>
  );
};

export default LoginPage;