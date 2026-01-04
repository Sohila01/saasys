
import React from 'react';
import { Squares2X2Icon, ShieldCheckIcon, GlobeAmericasIcon } from '@heroicons/react/24/solid';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('test@demo.com');
  const [password, setPassword] = React.useState('TestPass123!');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Form submitted, calling onLogin...');
    try {
      console.log('Awaiting onLogin...');
      await onLogin(email, password);
      console.log('onLogin completed successfully');
    } catch (err: any) {
      console.error('Login error caught:', err);
      // If it's a timeout error, let them retry or just close the form
      const msg = err.message || 'Login failed. Check your credentials.';
      if (msg.includes('timeout')) {
        setError('Request taking too long. Refreshing...');
        // Auto-refresh page after 2 seconds
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(msg);
      }
    } finally {
      console.log('Login attempt finished');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden lg:block space-y-10">
          <div className="flex items-center space-x-3">
             <div className="mesh-gradient p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Squares2X2Icon className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">NEXUS</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Enterprise Data <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Reimagined.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
              Experience the next generation of multi-tenant SaaS with dynamic schemas and AI-driven business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <ShieldCheckIcon className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="text-white font-bold mb-1">Bank-Grade Security</h4>
              <p className="text-slate-500 text-sm font-medium">Full RLS isolation and AES encryption.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <GlobeAmericasIcon className="h-8 w-8 text-violet-400 mb-3" />
              <h4 className="text-white font-bold mb-1">Global Scale</h4>
              <p className="text-slate-500 text-sm font-medium">Distributed infrastructure for zero latency.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md glass-card p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 mt-2 font-medium">Enter your credentials to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/50 text-red-600 text-sm font-semibold">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <input
                    type="email"
                    required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Keep me signed in</span>
                </label>
                <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Lost Key?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Enter Ecosystem'}
              </button>
            </form>

            <div className="mt-10">
              <div className="relative flex items-center mb-8">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Single Sign On</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                  Google
                </button>
                <button className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <img src="https://www.svgrepo.com/show/448239/microsoft.svg" className="h-5 w-5 mr-3" alt="Microsoft" />
                  Azure AD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
