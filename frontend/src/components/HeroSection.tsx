import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleChatNowClick = () => {
    navigate("/chat");
  };

  const handleLearnMoreClick = () => {
    // Smooth scroll to About section
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Your Personal<br />
              <span className="text-indigo-600">Mental Health Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
              Get supportive guidance and mental wellness information from our empathetic AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={handleChatNowClick} size="lg" className="btn-primary">
                Start Chat
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-secondary"
                onClick={handleLearnMoreClick}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              src="/doctor-illustration.avif"
              alt="Healthcare illustration"
              className="w-auto h-[400px] max-w-lg mx-auto object-contain animate-float hover:scale-105 transform-gpu transition-transform duration-300"
              loading="eager"
              style={{
                filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
                transform: 'perspective(1000px) rotateY(-5deg)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
