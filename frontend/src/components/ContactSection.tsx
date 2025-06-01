import React from "react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section className="py-16 bg-medical-light/20">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-8">
              Have questions or feedback about our AI health assistant? 
              We'd love to hear from you. Fill out the form or email us directly.
            </p>
            <div className="card-shadow p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Medical Disclaimer</h3>
              <p className="text-gray-700">
                This chatbot provides educational information only and is not a 
                substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified healthcare 
                provider with any questions you may have regarding a medical condition.
              </p>
            </div>
          </div>

          <div className="card-shadow p-8 rounded-xl">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-medical/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-medical/50"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-medical/50"
                  placeholder="Your message"
                ></textarea>
              </div>
              <Button type="submit" className="btn-primary w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
