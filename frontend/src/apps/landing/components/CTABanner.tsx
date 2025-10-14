import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTABanner: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#1F7368] via-[#004F4D] to-[#1F7368] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#63D7C7]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="text-[#63D7C7]" size={32} />
            <Sparkles className="text-white" size={24} />
            <Sparkles className="text-[#63D7C7]" size={32} />
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Ready to find your <span className="text-[#63D7C7]">perfect match?</span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of interns and companies who have already transformed their careers through I-Intern
          </motion.p>

          <Link to="/login">
            <motion.button
              className="bg-[#63D7C7] text-[#004F4D] px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 50px rgba(99, 215, 199, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-2">
                Join I-Intern Now
                <Sparkles size={24} className="group-hover:animate-spin" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};


