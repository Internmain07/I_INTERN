import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Briefcase, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] text-[#FFFAF3] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
        <motion.h1 
          className="mb-4 text-9xl md:text-[10rem] font-black text-[#63D7C7]"
          style={{ textShadow: '0 0 40px rgba(99, 215, 199, 0.3)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="mb-4 text-3xl md:text-4xl font-bold text-[#FFFAF3]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Oops! Page Not Found
        </motion.h2>
        
        <motion.p 
          className="mb-8 text-lg md:text-xl text-[#B3EDEB] max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The page you're looking for seems to have wandered off into the digital wilderness. 
          Don't worry though, we'll help you find your way back!
        </motion.p>
        
        <motion.div 
          className="flex justify-center gap-8 mb-8 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#63D7C7]"
          >
            <Compass size={48} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link to="/company/dashboard">
            <motion.button
              className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg bg-[#63D7C7] text-[#004F4D] shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(99, 215, 199, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} />
              Back to Dashboard
            </motion.button>
          </Link>
          
          <Link to="/company/internships">
            <motion.button
              className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-lg bg-transparent text-[#FFFAF3] border-2 border-[#63D7C7]"
              whileHover={{ scale: 1.05, background: 'rgba(99, 215, 199, 0.1)', borderColor: '#B3EDEB' }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase size={20} />
              View Internships
            </motion.button>
          </Link>
        </motion.div>
        
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <button 
            onClick={() => window.history.back()}
            className="text-[#63D7C7] hover:text-[#B3EDEB] inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Or go back to the previous page</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
