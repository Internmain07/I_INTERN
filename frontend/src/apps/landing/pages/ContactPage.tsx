import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion, Variants } from 'framer-motion';

// Helper component for SVG icons (unchanged)
type IconName = 'location' | 'mail' | 'phone' | 'clock' | 'linkedin' | 'twitter' | 'instagram' | 'facebook';
type IconProps = { name: IconName; className?: string };
const Icon: React.FC<IconProps> = ({ name, className }) => {
  const icons = {
    location: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    mail: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
     clock: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
  };
  return icons[name] || null;
};

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* Header Section */}
      <header className="relative bg-gray-900 text-white py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800 opacity-90"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-3/4 h-3/4 bg-cyan-400 bg-opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -top-1/2 -right-1/4 w-3/4 h-3/4 bg-teal-400 bg-opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        
        <motion.div 
            className="relative container mx-auto px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
            Get In <span className="text-cyan-300">Touch</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-300">
            We're here to help. Whether you have a question, a partnership proposal, or feedback, we'd love to hear from you.
          </motion.p>
        </motion.div>
      </header>

      <main>
        {/* Contact Form and Info Section */}
        <section className="py-16 sm:py-24">
          <motion.div 
            className="container mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <motion.div variants={fadeInUp} className="lg:col-span-1 bg-teal-600 text-white rounded-2xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Contact Information</h2>
                  <p className="mt-4 text-teal-100">Reach out to us directly through our official channels. We're available during business hours to assist you.</p>
                  <div className="mt-8 space-y-6">
                    <div className="flex items-start">
                      <Icon name="mail" className="w-6 h-6 text-cyan-300 mt-1" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Email</h3>
                        <a href="mailto:contact@i-intern.com" className="text-teal-100 hover:text-white transition-colors">contact@i-intern.com</a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Icon name="clock" className="w-6 h-6 text-cyan-300 mt-1" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">Business Hours</h3>
                        <p className="text-teal-100">Monday - Friday<br/>9:00 AM - 6:00 PM (IST)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-teal-500">
                  <h3 className="text-lg font-semibold">Follow Us</h3>
                  <div className="flex space-x-4 mt-4">
                    <a href="#" className="text-teal-200 hover:text-white transition-colors"><Icon name="twitter" className="w-6 h-6"/></a>
                    <a href="#" className="text-teal-200 hover:text-white transition-colors"><Icon name="linkedin" className="w-6 h-6"/></a>
                    <a href="#" className="text-teal-200 hover:text-white transition-colors"><Icon name="instagram" className="w-6 h-6"/></a>
                    <a href="#" className="text-teal-200 hover:text-white transition-colors"><Icon name="facebook" className="w-6 h-6"/></a>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={fadeInUp} className="lg:col-span-2 bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
                <motion.form 
                    className="mt-8 space-y-6"
                    // You can optionally add staggering to the form fields themselves
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" id="name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" id="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" id="subject" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows={5} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"></textarea>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <button type="submit" className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-bold rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform duration-300 hover:scale-105 active:scale-100">
                      Send Message
                    </button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;


