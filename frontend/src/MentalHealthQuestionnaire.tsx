import React, { useState } from "react";

const questions = [
  {
    key: "Gender",
    label: "What is your gender?",
    options: ["Male", "Female", "Other"],
  },
  {
    key: "Age",
    label: "What is your age?",
    type: "number",
  },
  {
    key: "City",
    label: "Which city do you live in?",
    type: "text",
    placeholder: "e.g., Delhi, Mumbai, Bangalore"
  },
  {
    key: "Profession",
    label: "What is your profession?",
    type: "text",
    placeholder: "e.g., Student, Engineer, Doctor"
  },
  {
    key: "Academic Pressure",
    label: "How much academic pressure do you feel? (1-5)",
    options: ["None", "Low", "Moderate", "High", "Extreme"],
  },
  {
    key: "Work Pressure",
    label: "How much work pressure do you feel? (1-5)",
    options: ["None", "Low", "Moderate", "High", "Extreme"],
  },
  {
    key: "CGPA",
    label: "What is your CGPA/GPA?",
    type: "number",
    step: "0.01",
    min: "0",
    max: "10"
  },
  {
    key: "Study Satisfaction",
    label: "How satisfied are you with your studies? (1-5)",
    options: ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"],
  },
  {
    key: "Job Satisfaction",
    label: "How satisfied are you with your job? (1-5)",
    options: ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied", "Not Applicable"],
  },
  {
    key: "Sleep Duration",
    label: "How many hours do you sleep per night?",
    options: ["<5", "5-6", "6-7", "7-8", ">8"],
  },
  {
    key: "Dietary Habits",
    label: "How would you describe your dietary habits?",
    options: ["Healthy", "Average", "Unhealthy"],
  },
  {
    key: "Degree",
    label: "What is your highest degree?",
    options: ["High School", "Bachelor's", "Master's", "PhD", "Other"],
  },
  {
    key: "Have you ever had suicidal thoughts ?",
    label: "Have you ever had suicidal thoughts?",
    options: ["Yes", "No"],
  },
  {
    key: "Work/Study Hours",
    label: "How many hours do you work/study per day?",
    type: "number",
    min: "0",
    max: "24"
  },
  {
    key: "Financial Stress",
    label: "How much financial stress do you feel? (1-5)",
    options: ["None", "Low", "Moderate", "High", "Extreme"],
  },
  {
    key: "Family History of Mental Illness",
    label: "Is there a family history of mental illness?",
    options: ["Yes", "No"],
  },
];

const initialForm = Object.fromEntries(questions.map(q => [q.key, ""]));

interface MentalHealthQuestionnaireProps {
  onClose: () => void;
}

interface FormData {
  [key: string]: string | number;
}

interface Result {
  risk_score: number;
  prediction: number;
  probability: number;
  status?: string;
  error?: string;
}

export default function MentalHealthQuestionnaire({ onClose }: MentalHealthQuestionnaireProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [questions[step].key]: value });
    setError(""); // Clear error when user makes a selection
  };

  const isFieldEmpty = (value: string | number): boolean => {
    return value === "" || value === null || value === undefined;
  };

  const handleNext = () => {
    const currentValue = form[questions[step].key];
    if (isFieldEmpty(currentValue)) {
      setError("Please answer this question before proceeding.");
      return;
    }
    setStep(s => Math.min(s + 1, questions.length - 1));
    setError("");
  };

  const handlePrev = () => {
    setStep(s => Math.max(s - 1, 0));
    setError("");
  };

  // Replace the handleSubmit function in your MentalHealthQuestionnaire.tsx with this:

const handleSubmit = async () => {
  const currentValue = form[questions[step].key];
  if (isFieldEmpty(currentValue)) {
    setError("Please answer all questions before submitting.");
    return;
  }

  setLoading(true);
  setError("");
  
  try {
    console.log("Submitting form data:", form);
    
    // Use environment variable for ML API URL
    const apiUrl = import.meta.env.VITE_ML_API_URL || "https://mental-health-ml-api-ki88.onrender.com";
    
    const response = await fetch(`${apiUrl}/api/predict`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Result = await response.json();
    console.log("Received result:", result);
    
    if (result.status === 'error') {
      throw new Error(result.error);
    }
    
    setResult(result);
  } catch (error) {
    console.error("Error:", error);
    setError(`Failed to calculate score: ${(error as Error).message}`);
  } finally {
    setLoading(false);
  }
};

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "HIGH", color: "text-red-600", bg: "bg-red-100" };
    if (score >= 50) return { level: "MODERATE", color: "text-orange-600", bg: "bg-orange-100" };
    if (score >= 30) return { level: "LOW-MODERATE", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "LOW", color: "text-green-600", bg: "bg-green-100" };
  };

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 rounded-t-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Mental Health Assessment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Question {step + 1} of {questions.length}
          </p>
        </div>

        <div className="p-6">
          {!result ? (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-700">
                  {currentQuestion.label}
                </label>
                
                {currentQuestion.options ? (
                  <select
                    name={currentQuestion.key}
                    value={form[currentQuestion.key]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an option...</option>
                    {currentQuestion.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={currentQuestion.key}
                    type={currentQuestion.type || "text"}
                    step={currentQuestion.step}
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    placeholder={currentQuestion.placeholder || ""}
                    value={form[currentQuestion.key]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 0}
                  className={`px-4 py-2 rounded-md ${
                    step === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Previous
                </button>
                
                {step < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    {loading ? "Calculating..." : "Get My Score"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Your Mental Health Assessment Results</h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getRiskLevel(result.risk_score).bg}`}>
                  <p className="text-lg font-semibold">
                    <span className="text-gray-700">Risk Level: </span>
                    <span className={getRiskLevel(result.risk_score).color}>
                      {getRiskLevel(result.risk_score).level}
                    </span>
                  </p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">
                    {result.risk_score.toFixed(1)}/100
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Prediction:</strong> {result.prediction === 1 ? "High Risk for Depression" : "Low Risk for Depression"}
                  </p>
                  
                </div>
                
                {result.risk_score > 50 && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-700">
                      ⚠️ <strong>Recommendation:</strong> Consider consulting with a mental health professional for proper evaluation and support.
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> This assessment is for informational purposes only and is not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}