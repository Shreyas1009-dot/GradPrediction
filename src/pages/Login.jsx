import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import AnimatedPage from '../components/AnimatedPage';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAuthError('');
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setAuthError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || 'Invalid email or password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Store session data to mark as logged in
      localStorage.setItem('grad_token', data.token);
      localStorage.setItem('grad_current_user', JSON.stringify(data.user));
      
      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (err) {
      setAuthError('Network error. Please try again later.');
      setIsSubmitting(false);
    }
  };


  return (
    <AnimatedPage className="flex-grow flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-md w-full space-y-8 backdrop-blur-md bg-white/70 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20"
      >
        <div>
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 shadow-inner border border-blue-200"
          >
            <LogIn className="h-8 w-8 text-blue-600 drop-shadow-sm" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm"
          >
            Welcome back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-2 text-center text-sm font-medium text-gray-600"
          >
            Sign in to access your predictions
          </motion.p>
        </div>

        {authError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3 shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-800">{authError}</p>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "input-field pl-10",
                    errors.email && "input-field-error"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={cn(
                    "input-field pl-10",
                    errors.password && "input-field-error"
                  )}
                  placeholder="********"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}
            </div>
          </motion.div>

          <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "btn-primary w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30",
                isSubmitting && "opacity-75 cursor-wait"
              )}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm font-medium text-gray-600"
        >
          Not registered yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            Create an account
          </Link>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
