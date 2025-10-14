import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Software Engineering Intern",
    company: "TechCorp",
    text: "I-Intern helped me land my dream internship at TechCorp. The platform made it so easy to find opportunities that matched my skills perfectly.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Michael Chen",
    role: "HR Director",
    company: "Innovation Labs",
    text: "We've hired 15 exceptional interns through I-Intern. The quality of candidates and the ease of the platform exceeded our expectations.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Intern",
    company: "StartupXYZ",
    text: "The personalized recommendations were spot-on! I found an internship that not only matched my interests but also helped me grow professionally.",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white to-[#B3EDEB]/10">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from interns and companies who found success with I-Intern
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2 
              }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
            >
              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className="text-[#63D7C7] fill-current" 
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-600 leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>

              {/* Profile section */}
              <div className="flex items-center">
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <h4 className="font-semibold text-[#004F4D]">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


