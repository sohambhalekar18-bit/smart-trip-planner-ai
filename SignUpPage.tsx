
import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon, PlaneIcon } from './icons';

export interface SignUpData {
    name: string;
    email: string;
    password?: string;
}

interface SignUpPageProps {
  onSignUp: (data: SignUpData) => void;
  onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
        onSignUp({ name, email, password });
    }
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
          <h2 className="text-3xl font-semibold text-center">Create Account</h2>
          <p className="text-center text-white/60 mt-2 text-sm">Join to start planning your trips</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80">Full Name</label>
              <div className="relative mt-2">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/10 border-2 border-transparent focus:border-white/30 rounded-lg pl-12 pr-4 py-3 placeholder:text-white/40 focus:ring-0 focus:outline-none transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Email Address</label>
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
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-white/60">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="font-semibold hover:text-white">Sign In</a>
          </p>
        </div>
      </div>

      <p className="absolute bottom-4 text-center text-sm text-white/50">&copy; {new Date().getFullYear()} Smart Trip Planner</p>
    </div>
  );
};

export default SignUpPage;