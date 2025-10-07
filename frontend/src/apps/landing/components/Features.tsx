import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, MessageCircle, Briefcase, Users, BarChart3 } from 'lucide-react';

export const Features: React.FC = () => {
  const studentFeatures = [
    {
      icon: Heart,
      title: "Personalized Recommendations",
      description: "Get internships tailored to your skills, interests, and career goals."
    },
    {
      icon: MapPin,
      title: "Internship Tracking",
      description: "Track your applications and stay updated on your application status."
    },
    {
      icon: MessageCircle,
      title: "Saved Internships",
      description: "Save interesting opportunities and apply when you're ready."
    }
  ];

  const companyFeatures = [
    {
      icon: Briefcase,
      title: "Easy Posting",
      description: "Post internship opportunities with our simple, intuitive interface."
    },
    {
      icon: Users,
      title: "Applicant Tracking",
      description: "Manage applications and candidates in one centralized dashboard."
    },
    {
      icon: BarChart3,
      title: "Direct Messaging",
      description: "Connect directly with candidates and streamline your hiring process."
    }
  ];

  return (
    <section id="students" className="py-20 bg-gradient-to-br from-[#B3EDEB]/20 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
            Features Built for Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools designed to connect students with their dream internships and help companies find exceptional talent.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Students Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center lg:text-left mb-12">
              <h3 className="text-3xl font-bold text-[#1F7368] mb-4">For Students</h3>
              <p className="text-gray-600 text-lg">Discover opportunities that match your aspirations</p>
            </div>

            <div className="space-y-8">
              {studentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#63D7C7] rounded-xl flex items-center justify-center">
                        <feature.icon size={24} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#004F4D] mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Companies Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            id="companies"
          >
            <div className="text-center lg:text-left mb-12">
              <h3 className="text-3xl font-bold text-[#1F7368] mb-4">For Companies</h3>
              <p className="text-gray-600 text-lg">Find and hire the best emerging talent</p>
            </div>

            <div className="space-y-8">
              {companyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#1F7368] rounded-xl flex items-center justify-center">
                        <feature.icon size={24} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#004F4D] mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


