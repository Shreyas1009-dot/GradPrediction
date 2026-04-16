import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="bg-brand-50 p-2 rounded-lg group-hover:bg-brand-100 transition-colors">
                <GraduationCap className="h-6 w-6 text-brand-600" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                GradPredict
              </span>
            </Link>
            
            <div className="hidden sm:-my-px sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    isActive(link.path)
                      ? "border-brand-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-gray-200 bg-white"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2 text-base font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-brand-50 text-brand-700 border-l-4 border-brand-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-brand-600 hover:bg-brand-700"
                >
                  <UserPlus className="w-5 h-5" />
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
