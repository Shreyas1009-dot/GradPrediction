/**
 * Normalizes various academic inputs to a 0-100 scale.
 */
export const normalizeInput = (value, type) => {
  if (!value || isNaN(value)) return 0;
  const num = parseFloat(value);
  
  switch (type) {
    case 'grade10':
    case 'grade12':
    case 'jee':
    case 'cet':
    case 'cat':
      return Math.min(Math.max(num, 0), 100);
    case 'cgpa':
      return Math.min(Math.max((num / 10) * 100, 0), 100);
    case 'gre':
      return Math.min(Math.max((num / 340) * 100, 0), 100);
    case 'neet':
      // Assuming score out of 720. If user enters percentile, they should use a different field or we handle it.
      // But usually NEET is score.
      return Math.min(Math.max((num / 720) * 100, 0), 100);
    case 'toefl':
      return Math.min(Math.max((num / 120) * 100, 0), 100);
    default:
      return Math.min(Math.max(num, 0), 100);
  }
};

/**
 * Computes the Admission Score (0-100) based on mode-specific weights.
 */
export const calculateAdmissionScore = (formData, mode) => {
  const normalized = {
    grade10: normalizeInput(formData.grade10, 'grade10'),
    grade12: normalizeInput(formData.grade12, 'grade12'),
    cgpa: normalizeInput(formData.cgpa, 'cgpa'),
    jee: normalizeInput(formData.jee, 'jee'),
    cet: normalizeInput(formData.cet, 'cet'),
    neet: normalizeInput(formData.neet, 'neet'),
    gre: normalizeInput(formData.gre, 'gre'),
    cat: normalizeInput(formData.cat, 'cat'),
    others: normalizeInput(formData.others || 85, 'others'), // Default 85 if not provided
  };

  let score = 0;

  if (mode === 'engineering') {
    // Engineering weights: 12th (0.20), CGPA (0.15), JEE/CET (0.45), CAT/GRE (0.10), others (0.10)
    score += normalized.grade12 * 0.20;
    score += normalized.cgpa * 0.15;
    
    // Take max of JEE and CET
    const nationalExam = Math.max(normalized.jee, normalized.cet);
    score += nationalExam * 0.45;
    
    // Take max of GRE and CAT
    const internationalExam = Math.max(normalized.gre, normalized.cat);
    score += internationalExam * 0.10;
    
    // Use 10th as "others" for engineering if not explicitly provided
    score += (formData.others ? normalized.others : normalized.grade10) * 0.10;
  } else if (mode === 'medical') {
    // Medical weights: 12th (0.25), NEET (0.55), 10th (0.10), others (0.10)
    score += normalized.grade12 * 0.25;
    score += normalized.neet * 0.55;
    score += normalized.grade10 * 0.10;
    score += normalized.others * 0.10;
  }

  return Math.min(Math.max(score, 0), 100);
};

/**
 * Calculates admission probability for a specific college.
 */
export const calculateProbability = (admissionScore, collegeCutoff) => {
  // Probability = clamp( (AdmissionScore / CollegeCutoff) * 100 , 5 , 95 )
  if (!collegeCutoff || collegeCutoff === 0) return 50; // Fallback
  
  const rawProb = (admissionScore / collegeCutoff) * 100;
  return Math.min(Math.max(rawProb, 5), 95);
};

/**
 * Categorizes probability into Tiers.
 */
export const getTier = (probability) => {
  if (probability > 85) return { label: 'Dream', color: 'bg-indigo-600' };
  if (probability >= 70) return { label: 'Reach', color: 'bg-amber-500' };
  return { label: 'Safe', color: 'bg-emerald-500' };
};
