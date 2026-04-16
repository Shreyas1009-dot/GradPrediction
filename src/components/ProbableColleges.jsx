import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Info } from 'lucide-react';
import { calculateProbability, getTier } from '../lib/predictionLogic';
import engineeringColleges from '../data/colleges/engineeringColleges.json';
import medicalColleges from '../data/colleges/medicalColleges.json';
import { cn } from '../lib/utils';

export default function ProbableColleges({ admissionScore, mode }) {
  const colleges = useMemo(() => {
    const dataset = mode === 'engineering' ? engineeringColleges : medicalColleges;
    
    // Calculate probability for each college and sort
    const processed = dataset.map(college => {
      const prob = calculateProbability(admissionScore, college.cutoff);
      return { ...college, probability: Math.round(prob) };
    });

    // Sort by probability descending
    return processed.sort((a, b) => b.probability - a.probability).slice(0, 10);
  }, [admissionScore, mode]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (!colleges || colleges.length === 0) return null;

  const modeColor = mode === 'engineering' ? 'blue' : 'rose';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-12 w-full max-w-4xl mx-auto"
    >
      <div className={cn(
        "rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-xl",
        mode === 'engineering' ? "bg-blue-50/90 border-blue-200" : "bg-rose-50/90 border-rose-200"
      )}>
        <div className={cn(
          "px-8 py-6 text-white flex items-center justify-between",
          mode === 'engineering' ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-gradient-to-r from-rose-600 to-pink-700"
        )}>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg">
                <Award className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-extrabold tracking-tight">Probable Colleges</h3>
                <p className="text-white/80 text-sm">Based on your {mode} academic profile</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-sm font-medium opacity-80 uppercase tracking-widest">Admission Score</div>
             <div className="text-3xl font-black">{Math.round(admissionScore)}<span className="text-lg opacity-60">/100</span></div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {colleges.map((college) => {
              const tier = getTier(college.probability);
              return (
                <motion.div
                  key={college.id}
                  variants={item}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className={cn(
                    "absolute top-0 left-0 w-1 h-full",
                    tier.color
                  )} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {college.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {college.category}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">
                          Cutoff: {college.cutoff}%
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm",
                      tier.color
                    )}>
                      {tier.label}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 px-0.5">
                        <span>Success Probability</span>
                        <span className={cn(
                          "transition-colors",
                          college.probability > 85 ? "text-indigo-600" : college.probability > 70 ? "text-amber-600" : "text-emerald-600"
                        )}>{college.probability}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${college.probability}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            college.probability > 85 ? "bg-indigo-600" : college.probability > 70 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 italic text-sm">
             <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Predictions based on historical data and current weights.</span>
             </div>
             <GraduationCap className="w-5 h-5 opacity-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
