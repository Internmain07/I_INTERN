import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, User, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', to: '/about' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'Contact', to: '/contact' }
  ];

  // Define styles for scrolled and non-scrolled states
  const navClass = isScrolled
    ? 'bg-[#FFFAF3]/90 backdrop-blur-lg shadow-lg' // Scrolled state
    : 'bg-transparent';                            // Top of page state (transparent)

  const linkColor = isScrolled
    ? 'text-[#181C19]'
    : 'text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]'; // Added text shadow for visibility

  const logoTextColor = isScrolled
    ? 'text-[#004F4D]'
    : 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]'; // Added text shadow for visibility
    
  const logoBgColor = isScrolled ? 'bg-[#1F7368]' : 'bg-white/20';
  const mobileButtonColor = isScrolled ? 'text-[#004F4D]' : 'text-white';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" onClick={handleLinkClick}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${logoBgColor}`}>
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className={`text-2xl font-bold transition-colors duration-300 ${logoTextColor}`}>
                I-Intern
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link to={link.to} key={index} onClick={handleLinkClick}>
                <motion.span
                  className={`font-medium transition-colors duration-300 hover:text-[#1F7368] ${linkColor} relative`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F7368]"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login" onClick={handleLinkClick}>
              <motion.button
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'text-[#1F7368] hover:bg-[#B3EDEB]/50'
                    : 'text-white hover:bg-white/10 [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <User size={18} className="inline mr-2" />
                Sign In
              </motion.button>
            </Link>
            <Link to="/register/student" onClick={handleLinkClick}>
              <motion.button
                className="px-6 py-2 rounded-xl font-semibold bg-[#63D7C7] text-[#004F4D] shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Building2 size={18} className="inline mr-2" />
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`lg:hidden p-2 rounded-lg ${mobileButtonColor}`}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden bg-[#FFFAF3]/95 backdrop-blur-md border-t border-[#B3EDEB]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="text-[#181C19] font-medium py-2 hover:text-[#1F7368] transition-colors duration-200 rounded-lg px-3 hover:bg-[#B3EDEB]/30"
                    onClick={handleLinkClick}
                  >
                    <motion.span
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#B3EDEB] space-y-3">
                  <Link to="/login" onClick={handleLinkClick}>
                    <motion.button 
                      className="w-full text-left text-[#1F7368] font-semibold py-3 hover:bg-[#B3EDEB]/50 rounded-lg px-3 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User size={18} className="inline mr-2" />
                      Sign In
                    </motion.button>
                  </Link>
                  <Link to="/register/student" onClick={handleLinkClick}>
                    <motion.button 
                      className="w-full bg-[#63D7C7] text-[#004F4D] py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:bg-opacity-90"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Building2 size={18} className="inline mr-2" />
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};


