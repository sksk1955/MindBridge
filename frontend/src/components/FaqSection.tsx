import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "Is this chatbot a real doctor?",
      answer:
        "No, our AI assistant is not a doctor or healthcare provider. It's an AI tool designed to provide educational information based on medical literature. It should never replace professional medical advice, diagnosis, or treatment from qualified healthcare providers.",
    },
    {
      question: "Can it diagnose my condition?",
      answer:
        "No, our AI assistant cannot provide diagnoses. It can help explain medical concepts, conditions, and general health information, but proper diagnosis requires in-person evaluation by a qualified healthcare provider who can review your complete medical history and perform appropriate examinations and tests.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes, we take data privacy seriously. Your conversations are anonymous and we don't store any personally identifiable information. We use industry-standard encryption to protect all data.",
    },
    {
      question: "How accurate is the information?",
      answer:
        "Our AI is trained on peer-reviewed medical literature and reputable healthcare sources. However, medical knowledge evolves constantly, and AI may have limitations. We strive for accuracy but always recommend verifying critical information with healthcare professionals.",
    },
    {
      question: "Can I use this for emergencies?",
      answer:
        "No. If you're experiencing a medical emergency, please call emergency services (100 in India) or go to your nearest emergency room immediately. Our AI assistant is not designed to handle emergencies and cannot provide urgent care or advice.",
    },
    {
      question: "Is this service free?",
      answer:
        "Yes, our basic AI assistant service is free to use. We may offer premium features in the future, but core functionality will remain accessible to all users without charge.",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="section-container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Find answers to common questions about our AI health assistant
        </p>

        <div className="max-w-3xl mx-auto mt-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-shadow rounded-xl border-none"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:text-medical">
                  <span className="text-lg font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
