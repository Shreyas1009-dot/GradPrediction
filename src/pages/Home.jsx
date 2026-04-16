import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, BarChart } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

export default function Home() {
  return (
    <AnimatedPage className="flex flex-col items-center justify-center flex-grow bg-transparent px-4 py-16 text-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-white/10 shadow-2xl"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 mb-6 bg-brand-500/20 backdrop-blur-md rounded-2xl shadow-inner border border-brand-400/30"
        >
          <GraduationCap className="w-12 h-12 text-blue-400 drop-shadow-lg" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md"
        >
          Predict your <span className="text-blue-400 bg-clip-text drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">admission chances</span> with AI.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Leverage our advanced predictive model based on 10th/12th scores, JEE, CET, NEET, and CAT to see where you stand for your dream college.
        </motion.p>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)" }} whileTap={{ scale: 0.95 }} className="rounded-xl">
            <Link
              to="/register"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-colors w-full gap-2 border border-blue-400/50"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl">
            <Link
              to="/predict"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors w-full gap-2 border border-white/20"
            >
              <BarChart className="w-5 h-5" />
              Try Sandbox
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
