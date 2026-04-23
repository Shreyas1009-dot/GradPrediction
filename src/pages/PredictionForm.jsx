import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calculator, Target, BookOpen, AlertCircle, ArrowRight, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import AnimatedPage from '../components/AnimatedPage';
import { calculateAdmissionScore } from '../lib/predictionLogic';
import ProbableColleges from '../components/ProbableColleges';

export default function PredictionForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'engineering' or 'medical'
  const [admissionScore, setAdmissionScore] = useState(null);
  const [formData, setFormData] = useState({
    grade10: '',
    grade12: '',
    cgpa: '',
    gre: '',
    toefl: '',
    jee: '',
    cet: '',
    neet: '',
    cat: '',
    others: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.grade10) newErrors.grade10 = '10th score is required';
    else if (Number(formData.grade10) > 100) newErrors.grade10 = 'Max is 100%';

    if (!formData.grade12) newErrors.grade12 = '12th score is required';
    else if (Number(formData.grade12) > 100) newErrors.grade12 = 'Max is 100%';

    if (formData.cgpa && (Number(formData.cgpa) > 10)) newErrors.cgpa = 'Max CGPA is 10.0';
    if (formData.gre && (Number(formData.gre) > 340)) newErrors.gre = 'Max GRE is 340';
    if (formData.toefl && (Number(formData.toefl) > 120)) newErrors.toefl = 'Max TOEFL is 120';
    if (formData.neet && (Number(formData.neet) > 720)) newErrors.neet = 'Max NEET is 720';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const score = calculateAdmissionScore(formData, mode);
      setAdmissionScore(score);
      
      const token = localStorage.getItem('grad_token');
      if (token) {
        await fetch('/api/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tenth: formData.grade10,
            twelfth: formData.grade12,
            cgpa: formData.cgpa,
            result: `${Math.round(score)}% - ${mode}`
          })
        });
      }

      setIsSubmitting(false);
      // Wait a bit to show the results on the same page before scrolling
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error('Failed to save prediction', err);
      const score = calculateAdmissionScore(formData, mode);
      setAdmissionScore(score);
      setIsSubmitting(false);
    }
  };

  if (!mode) {
    return (
      <AnimatedPage className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-blue-600/10 rounded-3xl mb-6"
          >
            <Target className="w-12 h-12 text-blue-600" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Select Your Stream
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-12"
          >
            Choose your academic field to get personalized admission predictions.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ModeButton 
              title="Engineering" 
              description="JEE, BITSAT, GRE, GATE paths"
              icon={<Cpu className="w-8 h-8" />}
              onClick={() => setMode('engineering')}
              color="blue"
            />
            <ModeButton 
              title="Medical" 
              description="NEET, AIIMS, MBBS paths"
              icon={<Activity className="w-8 h-8" />}
              onClick={() => setMode('medical')}
              color="rose"
            />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex-grow bg-transparent py-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl flex gap-2">
             <button 
               onClick={() => { setMode('engineering'); setAdmissionScore(null); }}
               className={cn(
                 "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                 mode === 'engineering' ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
               )}
             >
               <Cpu className="w-4 h-4" /> Engineering
             </button>
             <button 
               onClick={() => { setMode('medical'); setAdmissionScore(null); }}
               className={cn(
                 "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                 mode === 'medical' ? "bg-rose-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
               )}
             >
               <Activity className="w-4 h-4" /> Medical
             </button>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/70 p-6 rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-10 text-center">
            <motion.h2 
              key={mode}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
            >
              {mode === 'engineering' ? 'Engineering' : 'Medical'} Predictor
            </motion.h2>
            <p className="mt-4 text-lg text-gray-700">
              {mode === 'engineering' 
                ? "Calculate your chances for top Tier-1 & Tier-2 Engineering colleges."
                : "Evaluate your eligibility for premium Medical institutions across India."}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className={cn(
              "px-6 py-4 flex items-center justify-between text-white shadow-md transition-colors",
              mode === 'engineering' ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-rose-600 to-pink-600"
            )}>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <h3 className="text-lg font-semibold drop-shadow-sm">Academic Details</h3>
              </div>
              <span className="text-white/80 text-sm font-medium">Please fill all fields for accuracy</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10">
              {Object.keys(errors).length > 0 && (
                <div className="mb-8 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3 shadow-sm">
                   <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                   <div>
                      <h4 className="text-sm font-bold text-red-800">Validation Errors:</h4>
                      <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                         {Object.values(errors).map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                   </div>
                </div>
              )}

              <div className="space-y-10">
                {/* Foundation Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                    <BookOpen className="h-5 w-5 text-slate-500" />
                    <h3 className="text-lg font-bold text-gray-800">Foundation Scores</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <InputField
                      label="10th Percentage *"
                      id="grade10"
                      placeholder="e.g. 92.5"
                      value={formData.grade10}
                      onChange={handleChange}
                      error={errors.grade10}
                    />
                    <InputField
                      label="12th Percentage *"
                      id="grade12"
                      placeholder="e.g. 88.0"
                      value={formData.grade12}
                      onChange={handleChange}
                      error={errors.grade12}
                    />
                    <InputField
                      label={mode === 'engineering' ? "Undergrad CGPA" : "Bio/Chem Marks (%)"}
                      id={mode === 'engineering' ? "cgpa" : "others"}
                      placeholder={mode === 'engineering' ? "e.g. 8.5" : "e.g. 95"}
                      value={mode === 'engineering' ? formData.cgpa : formData.others}
                      onChange={handleChange}
                      error={mode === 'engineering' ? errors.cgpa : null}
                      helperText={mode === 'engineering' ? "Out of 10.0" : "Optional"}
                    />
                  </div>
                </section>

                {/* Exams Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                    <Target className={cn("h-5 w-5", mode === 'engineering' ? "text-blue-500" : "text-rose-500")} />
                    <h3 className="text-lg font-bold text-gray-800">Entrance Examinations</h3>
                  </div>
                  
                  {mode === 'engineering' ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                      <InputField
                        label="JEE Main / Adv %"
                        id="jee"
                        placeholder="Percentile"
                        value={formData.jee}
                        onChange={handleChange}
                      />
                      <InputField
                        label="CET / State Score"
                        id="cet"
                        placeholder="Percentile"
                        value={formData.cet}
                        onChange={handleChange}
                      />
                      <InputField
                        label="GRE / GATE Score"
                        id="gre"
                        placeholder="e.g. 320"
                        value={formData.gre}
                        onChange={handleChange}
                        error={errors.gre}
                        helperText="Max 340"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InputField
                        label="NEET Score *"
                        id="neet"
                        placeholder="Out of 720"
                        value={formData.neet}
                        onChange={handleChange}
                        error={errors.neet}
                        helperText="Required for Medical"
                      />
                      <InputField
                        label="Other Medical Exam"
                        id="others"
                        placeholder="Score/Percentile"
                        value={formData.others}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </section>

                {mode === 'engineering' && (
                  <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                      <GraduationCap className="h-5 w-5 text-purple-500" />
                      <h3 className="text-lg font-bold text-gray-800">Management & International</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <InputField
                        label="CAT Percentile"
                        id="cat"
                        placeholder="e.g. 95"
                        value={formData.cat}
                        onChange={handleChange}
                      />
                      <InputField
                        label="TOEFL Score"
                        id="toefl"
                        placeholder="e.g. 105"
                        value={formData.toefl}
                        onChange={handleChange}
                        error={errors.toefl}
                        helperText="Max 120"
                      />
                    </div>
                  </section>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all",
                    mode === 'engineering' 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25" 
                      : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25",
                    "shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Results...
                    </>
                  ) : (
                    <>
                      Go Predict Probability
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        <div id="results-section">
          <AnimatePresence>
            {admissionScore !== null && (
              <ProbableColleges admissionScore={admissionScore} mode={mode} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
}

function ModeButton({ title, description, icon, onClick, color }) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative text-left p-8 rounded-[2rem] border-2 transition-all overflow-hidden bg-white/50 backdrop-blur-sm",
        color === 'blue' ? "border-blue-100 hover:border-blue-500 hover:bg-blue-50/50" : "border-rose-100 hover:border-rose-500 hover:bg-rose-50/50"
      )}
    >
      <div className={cn(
        "absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity",
        color === 'blue' ? "bg-blue-600" : "bg-rose-600"
      )} />
      
      <div className={cn(
        "inline-flex p-4 rounded-2xl mb-6 transition-colors shadow-sm",
        color === 'blue' ? "bg-blue-600 text-white group-hover:bg-blue-700" : "bg-rose-600 text-white group-hover:bg-rose-700"
      )}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
      
      <div className="mt-8 flex items-center gap-2 font-bold text-sm tracking-tight">
        <span className={color === 'blue' ? "text-blue-600" : "text-rose-600"}>Get Started</span>
        <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", color === 'blue' ? "text-blue-600" : "text-rose-600")} />
      </div>
    </motion.button>
  );
}

function InputField({ label, id, value, onChange, placeholder, error, helperText }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 bg-white/50 border-gray-100 focus:border-blue-500 focus:bg-white text-gray-900 outline-none transition-all shadow-sm group-hover:border-gray-300",
            error && "border-red-300 focus:border-red-500 bg-red-50/50"
          )}
          placeholder={placeholder}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 ml-1 text-xs font-bold text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 ml-1 text-xs font-medium text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
}
