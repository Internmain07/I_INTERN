import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Handshake } from 'lucide-react';
import { Step } from '../types';

const steps: Step[] = [
  {
    number: 1,
    title: "Sign up & create profile",
    description: "Build your professional profile and showcase your skills, education, and career goals."
  },
  {
    number: 2,
    title: "Match with opportunities/talent",
    description: "Our smart algorithm connects you with the perfect internships or candidates."
  },
  {
    number: 3,
    title: "Apply, connect & grow",
    description: "Start your journey with meaningful connections and real-world experience."
  }
];

const icons = [UserPlus, Search, Handshake];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with I-Intern is simple and straightforward
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={step.number}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#B3EDEB]/30 to-white shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2 
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5 
                }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-20 h-20 bg-[#63D7C7] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.number}
                </motion.div>

                <div className="mb-4 flex justify-center">
                  <Icon size={48} className="text-[#1F7368]" />
                </div>

                <h3 className="text-2xl font-bold text-[#004F4D] mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


