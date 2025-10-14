import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#B3EDEB]/30 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-[#B3EDEB] p-12 rounded-3xl shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-[#1F7368] rounded-full mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Mail size={32} className="text-white" />
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-bold text-[#004F4D] mb-4">
                Stay Updated with I-Intern
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Get the latest internship opportunities, career tips, and industry insights delivered to your inbox.
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#1F7368]/20 focus:border-[#1F7368] text-gray-700 placeholder-gray-500"
                required
              />
              
              <motion.button
                type="submit"
                className="bg-[#1F7368] text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#004F4D"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>
                    ✓ Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.form>

            {isSubscribed && (
              <motion.div
                className="text-center mt-4 text-[#1F7368] font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                🎉 Thank you for subscribing! You'll hear from us soon.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};


