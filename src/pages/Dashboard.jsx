import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, ArrowRight, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

export default function Dashboard() {
  const location = useLocation();
  const { recentProbability, predictionData } = location.state || {};

  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('grad_token');
      if (!token) {
        setLoading(false);
        // Maybe redirect to login if no mock state either?
        // if (!recentProbability) navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/predictions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map(item => ({
            id: item.id,
            date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            score: parseInt(item.result),
            programs: ['Target Program'] // Backend currently only saves summary metrics
          }));
          setHistory(formatted);
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('grad_token');
          localStorage.removeItem('grad_current_user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching prediction history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const getStatusColor = (prob) => {
    if (!prob) return "text-gray-400 bg-gray-50 border-gray-200";
    if (prob >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (prob >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };
  
  const getProgressColor = (prob) => {
    if (!prob) return "text-gray-200";
    if (prob >= 80) return "text-green-500";
    if (prob >= 60) return "text-yellow-500";
    return "text-red-500";
  };


  return (
    <AnimatedPage className="flex-grow bg-transparent py-10 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-white drop-shadow-md"
          >
            Welcome back, Student
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-blue-100"
          >
            Here's your latest admission prediction overview.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Result Card */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 text-blue-500/10 transform rotate-12">
                <TargetIcon className="w-64 h-64" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Prediction</h2>
                </div>

                {recentProbability ? (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-shrink-0 text-center">
                      <div className="relative w-48 h-48 drop-shadow-lg">
                        {/* Circular Progress */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-gray-100" />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className={getProgressColor(recentProbability)}
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * recentProbability) / 100 }}
                            transition={{ duration: 2, ease: "anticipate" }}
                          />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                          <span className="text-5xl font-extrabold text-gray-900">
                            {recentProbability}<span className="text-2xl text-gray-500">%</span>
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-4 py-1.5 mt-4 rounded-full text-sm font-bold border shadow-sm ${getStatusColor(recentProbability)}`}>
                        {recentProbability >= 80 ? 'High Chance' : recentProbability >= 60 ? 'Moderate Chance' : 'Low Chance'}
                      </span>
                    </div>

                    <div className="flex-grow w-full">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Input Synopsis</h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                        {[
                          { label: '10th Score', value: `${predictionData?.grade10 || '--'}%` },
                          { label: '12th Score', value: `${predictionData?.grade12 || '--'}%` },
                          { label: 'Undergrad CGPA', value: predictionData?.cgpa || '--' },
                          { label: 'Top Competitive', value: ['jee', 'cet', 'neet', 'cat'].map(k => predictionData?.[k]).find(v => v) || '--' },
                        ].map((item, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (idx * 0.1) }}
                            className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"
                          >
                            <dt className="text-gray-500 font-medium">{item.label}</dt>
                            <dd className="font-bold text-gray-900">{item.value}</dd>
                          </motion.div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-4 border-2 border-dashed border-blue-200">
                      <BarChart3 className="h-10 w-10 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Recent Predictions</h3>
                    <p className="text-gray-500 mb-6 font-medium">You haven't run any admission predictions yet today.</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/predict"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                      >
                        Run New Prediction
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Insight / Suggestion block */}
            {recentProbability && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-start gap-4 relative z-10">
                  <Award className="h-10 w-10 text-blue-200 shrink-0 drop-shadow-md" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
                    <p className="text-blue-100 text-sm leading-relaxed max-w-2xl font-medium">
                      Based on our prediction model matching similar student profiles, 
                      we recommend targeting universities in the Top 50-100 ranking bracket. 
                      Improving your standardized test scores slightly could increase your probability by 15-20%.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar / History */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="col-span-1 border-gray-200 space-y-6"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Past Predictions
                </h3>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">View All</button>
              </div>

              <div className="space-y-4 flex-grow">
                {history.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (idx * 0.1) }}
                    key={item.id} 
                    className="group relative bg-gray-50/80 rounded-2xl p-4 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors tracking-wide">
                        {item.date}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${getStatusColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <ul className="text-sm font-bold text-gray-800">
                        {item.programs.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 pt-6 border-t border-gray-100"
              >
                <div className="rounded-xl bg-blue-50/80 p-4 border border-blue-100 flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Predictions are generated using historical data. Actual admission outcomes may vary depending on extracurriculars, essays, and changing university quotas.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}

function TargetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
