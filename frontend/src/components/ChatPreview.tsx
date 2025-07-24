import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const ChatPreview = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setChatStarted(true);
      setInputValue("");
    }
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  const exampleQuestions = [
    "How can I manage stress and anxiety?",
    "What are some good self-care practices?",
    "How can I improve my sleep quality?",
    "What are mindfulness techniques?",
    "How can I build better mental health habits?",
    "What should I do if I'm feeling overwhelmed?"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        <h2 className="section-title">Experience MediHelp AI</h2>
        <p className="section-subtitle">
          Try our AI health assistant and see how it can help answer your medical questions
        </p>

        <div className="max-w-3xl mx-auto card-shadow p-6 rounded-2xl bg-gray-50">
          <div className="bg-white rounded-xl p-4 mb-4 h-72 flex flex-col overflow-y-auto">
            {!chatStarted ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                <div className="w-16 h-16 bg-medical-light/30 rounded-full flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-medical text-white rounded-full flex items-center justify-center animate-pulse-gentle">
                    <span className="font-bold">AI</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Health Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Ask me anything about health conditions, symptoms, or medical information.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="text-left text-sm bg-white border border-gray-200 rounded-lg p-2 hover:border-medical transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="chat-bubble-user mb-4">
                  What are common symptoms of diabetes?
                </div>
                <div className="chat-bubble-bot">
                  <p className="mb-2">Common symptoms of diabetes include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Increased thirst and frequent urination</li>
                    <li>Extreme hunger or fatigue</li>
                    <li>Blurred vision</li>
                    <li>Slow-healing sores</li>
                    <li>Unexplained weight loss</li>
                    <li>Numbness in hands/feet</li>
                  </ul>
                  <p className="mt-2">
                    If you experience these symptoms, consult a healthcare provider for proper diagnosis and treatment. Early detection is crucial for managing diabetes effectively.
                  </p>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your health question here..."
              className="flex-grow rounded-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-medical/50"
            />
            <Button type="submit" className="btn-primary rounded-full h-12 w-12 flex items-center justify-center p-0">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
