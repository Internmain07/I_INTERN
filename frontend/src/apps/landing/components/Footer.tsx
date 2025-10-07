import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const companyLinks = [
    { name: 'About us', href: '/about' },
    { name: 'We\'re hiring', href: '#careers' },
    { name: 'Team Diary', href: '#team-diary' },
    { name: 'Blog', href: '#blog' },
  ];

  const forEmployersLinks = [
    { name: 'Hire interns for your company', href: '/register/company' },
    { name: 'Post a Job', href: '/register/company' },
    { name: 'List of Companies', href: '#companies' },
    { name: 'College TPO registration', href: '#tpo-registration' },
  ];

  const forStudentsLinks = [
    { name: 'Our Services', href: '#services' },
    { name: 'Free Job Alerts', href: '#job-alerts' },
    { name: 'Resume Maker', href: '#resume-maker' },
    { name: 'Jobs for Women', href: '#women-jobs' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', href: '#terms' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Contact us', href: '/contact' },
    { name: 'Sitemap', href: '#sitemap' },
  ];

  const socialLinks = [
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-[#004F4D] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-12 h-12 bg-[#63D7C7] rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <GraduationCap size={24} className="text-[#004F4D]" />
              </motion.div>
              <span className="text-2xl font-bold">I-Intern</span>
            </div>
            <p className="text-white/80 leading-relaxed max-w-xs">
              Connecting talent with opportunity. Building the future, one internship at a time.
            </p>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-[#63D7C7] transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Employers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">For Employers</h3>
            <ul className="space-y-3">
              {forEmployersLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-[#63D7C7] transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">For Students</h3>
            <ul className="space-y-3">
              {forStudentsLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-[#63D7C7] transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Legal & Contact</h3>
            <ul className="space-y-3 mb-6">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-[#63D7C7] transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#63D7C7] transition-colors duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#63D7C7"
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="pt-8 border-t border-white/20 text-center text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 I-Intern. All rights reserved. Built with ❤️ for the future workforce.</p>
        </motion.div>
      </div>
    </footer>
  );
};


