
import React from "react";
import { MessageSquare, Lightbulb, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <MessageSquare className="w-12 h-12 text-medical" />,
      title: "Ask a question",
      description:
        "Type your concerned health related questions in a clear, conversational way.",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-medical" />,
      title: "Get accurate medical insights",
      description:
        "Receive evidence-based information drawn from trusted medical sources.",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-medical" />,
      title: "Learn or act with confidence",
      description:
        "Use the information to better understand your health or discuss with your doctor.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="section-container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Getting reliable health information has never been simpler
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-medical-light rounded-full scale-125 opacity-20"></div>
                  <div className="relative card-shadow rounded-full p-4 bg-white">{step.icon}</div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full -translate-y-1/2 bg-gray-100"></div>
                  )}
                </div>
                <div className="mb-2 text-2xl font-bold text-gray-800">Step {index + 1}</div>
                <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
