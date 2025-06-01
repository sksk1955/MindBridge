import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="section-container">
        <h2 className="section-title">Comprehensive Healthcare Information</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-8">
            MediHelp is your 24/7 AI health assistant, providing reliable medical information
            across all healthcare topics. Whether you're seeking to understand symptoms,
            learn about conditions, or explore treatment options, we're here to help.
          </p>
          <p className="text-lg text-gray-700">
            Using advanced AI technology and evidence-based medical knowledge, we provide
            accurate, up-to-date information to help you make informed decisions about
            your health. Remember, while we offer comprehensive information, we're here
            to educate, not diagnose.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
