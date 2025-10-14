import React from 'react';
import { Link } from 'react-router-dom';
// import { LogoCarousel } from './LogoCarousel';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the radial gradient background animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for the animated background
const AnimatedBackground = styled.div`
  inset: 0;
  background: radial-gradient(circle at 20% 80%, #1F7368 0%, transparent 30%),
              radial-gradient(circle at 80% 20%, #004F4D 0%, transparent 30%),
              radial-gradient(circle at 50% 50%, #63D7C7 0%, transparent 40%);
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  opacity: 0.8;
  filter: blur(80px); /* Soften the gradient */
`;


export const Hero: React.FC = () => {
  return (
    <section className="bg-[#004F4D] text-[#FFFAF3] relative overflow-hidden">
      <AnimatedBackground /> {/* Apply the animated background */}

      {/* Existing decorative circles - kept for subtle depth */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#63D7C7]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#63D7C7]/5 rounded-full blur-2xl animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center min-h-screen pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            >
              <span className="text-[#F8FAFC]">Kickstart Your Career.</span> <br />
              <span className="text-[#63D7C7]">Find the Right Internship.</span>
            </motion.h1>

                        <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
              I-Intern bridges the gap between talented interns and innovative companies, empowering futures one opportunity at a time.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            >
              <Link to="/browse-internships">
                <motion.button
                  className="bg-[#63D7C7] text-[#004F4D] w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#63D7C7]/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Internships
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/hire-interns">
                <motion.button
                  className="bg-[#FFFAF3] text-[#1F7368] w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Hire Interns
                  <Users size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - (animation removed) */}
          <div className="flex justify-center items-center w-full h-full min-h-[400px]">
            {/* Animation removed: HeroAnimation component not found */}
          </div>
        </div>
      </div>
      {/* Temporarily hidden - Trusted by Top Companies section */}
      {/* <div className="w-full relative z-10 pb-12">
        <LogoCarousel />
      </div> */}
    </section>
  );
};


