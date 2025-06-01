
import React from "react";
import { BookOpen, Lock, Clock, ThumbsUp } from "lucide-react";

const TrustSection = () => {
  const trustPoints = [
    {
      icon: <BookOpen className="w-8 h-8 text-medical" />,
      title: "Verified Medical Sources",
      description:
        "Our AI is trained on peer-reviewed medical literature and trusted healthcare guidelines.",
    },
    {
      icon: <Lock className="w-8 h-8 text-medical" />,
      title: "Anonymous & Private",
      description:
        "Your conversations are private and we don't store personally identifiable information.",
    },
    {
      icon: <Clock className="w-8 h-8 text-medical" />,
      title: "Available 24/7",
      description:
        "Get answers to your health questions whenever you need them, day or night.",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-medical" />,
      title: "User-Friendly Interface",
      description:
        "Simple, intuitive design makes it easy to get the information you need quickly.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-medical-light/20">
      <div className="section-container">
        <h2 className="section-title">Why Use This Chatbot?</h2>
        <p className="section-subtitle">
          Designed with your needs in mind, our AI assistant offers several unique advantages
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {trustPoints.map((point, index) => (
            <div key={index} className="card-shadow p-6 flex flex-col items-center text-center">
              <div className="mb-4">{point.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
