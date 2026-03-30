import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="backdrop-blur-xl bg-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-full max-w-md p-10 border border-white/40 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <img
              src={logo}
              alt="Travel Rumours Logo"
              className="relative w-28 h-28 mx-auto object-contain rounded-3xl shadow-xl border border-white/50"
            />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-md">
            ADMIN PANEL
          </h1>
          <p className="font-bold text-white/90 uppercase tracking-[0.2em] text-[10px] drop-shadow-sm">
            Travel Rumours Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-black text-white uppercase tracking-widest pl-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/70 placeholder:font-bold font-extrabold focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all backdrop-blur-md"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-black text-white uppercase tracking-widest pl-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/70 placeholder:font-bold font-extrabold focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all backdrop-blur-md"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white px-4 py-3 rounded-xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-orange-600 font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_4px_15px_0_rgba(255,255,255,0.2)] hover:shadow-[0_4px_25px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-lg uppercase tracking-tight"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-orange-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      {/* Decorative footer */}
      <div className="absolute bottom-10 inset-x-0 text-center">
        <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
          Powered by Travel Rumours Cloud
        </p>
      </div>
    </div>
  );
};

export default Login;
