import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import AnimatedPage from '../components/AnimatedPage';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        setErrors({ email: data.message || 'Registration failed' });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ email: 'Network error. Please try again later.' });
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-inner border border-indigo-200 mb-6">
            <User className="h-8 w-8 text-indigo-600 drop-shadow-sm" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            Create an account
          </h2>
          <p className="mt-3 text-center text-sm font-medium text-gray-600">
            Join thousands of students predicting their future.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-green-50 p-6 border border-green-200 text-center shadow-lg"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4 shadow-inner">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900">Registration Successful</h3>
            <p className="mt-2 text-sm font-medium text-green-700">
              Your account has been created. Redirecting to login...
            </p>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(
                      "input-field pl-10",
                      errors.name && "input-field-error"
                    )}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

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
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
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
                  {errors.password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "btn-primary w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30",
                  isSubmitting && "opacity-75 cursor-wait"
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        )}

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm font-medium text-gray-600"
        >
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
