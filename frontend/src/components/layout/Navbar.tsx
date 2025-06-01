import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();
  
  // Function to handle button click
  const handleChatNowClick = () => {
    // Navigate to the chat page
    navigate("/chat");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm",
        isScrolled
          ? "bg-white/90 shadow-soft py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-medical-dark font-bold text-2xl">
                Medi
              </span>
              <span className="text-medical font-medium">Help</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-medical transition duration-200">
              About
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-medical transition duration-200">
              How It Works
            </a>
            <a href="#faq" className="text-gray-600 hover:text-medical transition duration-200">
              FAQs
            </a>
            <Button onClick={handleChatNowClick} className="btn-primary">Chat Now</Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="mt-4 pb-4 md:hidden flex flex-col space-y-4">
            <a href="#about" className="text-gray-600 hover:text-medical transition duration-200">
              About
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-medical transition duration-200">
              How It Works
            </a>
            <a href="#faq" className="text-gray-600 hover:text-medical transition duration-200">
              FAQs
            </a>
            <Button className="btn-primary w-full">Chat Now</Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
