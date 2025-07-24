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
      question: "Is this chatbot a mental health professional?",
      answer:
        "No, our AI assistant is not a therapist, counselor, or mental health provider. It's an AI tool designed to provide supportive information and resources about mental wellness. It should never replace professional mental health care or counseling.",
    },
    {
      question: "Can it diagnose mental health conditions?",
      answer:
        "No, our AI assistant cannot diagnose mental health conditions. For proper diagnosis and treatment, please consult with a qualified mental health professional who can provide appropriate evaluation and care.",
    },
    {
      question: "Is my data private?",
      answer:
        "Yes, we take your privacy very seriously. Your conversations are anonymous and we don't store any personally identifiable information. All data is encrypted and handled with the utmost confidentiality.",
    },
    {
      question: "What kind of support can I get?",
      answer:
        "Our AI can provide information about mental wellness, stress management techniques, self-care strategies, and general emotional support. We can also help you find resources for professional mental health services.",
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
