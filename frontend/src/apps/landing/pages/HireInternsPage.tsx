import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Shield, 
  Zap, 
  CheckCircle, 
  Clock,
  Award,
  Brain,
  DollarSign,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';const HireInternsPage: React.FC = () => {
  const benefits = [
    {
      icon: <Target size={32} />,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm matches you with the most qualified candidates based on your specific requirements and company culture.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Save Time & Resources',
      description: 'Streamline your hiring process. Post once, reach thousands of qualified candidates, and hire faster than ever before.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Pre-Verified Candidates',
      description: 'All candidates are verified and assessed through our A.U.R.A system, ensuring you get genuine, skilled talent.'
    },
    {
      icon: <DollarSign size={32} />,
      title: 'Cost-Effective Hiring',
      description: 'Reduce recruitment costs significantly. No agency fees, no hidden charges. Pay only for the plan that fits your needs.'
    },
    {
      icon: <Brain size={32} />,
      title: 'Access to Fresh Talent',
      description: 'Connect with ambitious interns from top institutions across India, bringing fresh perspectives and innovative ideas.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics & Insights',
      description: 'Track your hiring performance with detailed analytics, helping you optimize your recruitment strategy.'
    }
  ];

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Instant Posting',
      description: 'Post internship opportunities in minutes and start receiving applications immediately.'
    },
    {
      icon: <Users size={24} />,
      title: 'Large Talent Pool',
      description: 'Access thousands of pre-screened interns actively looking for internship opportunities.'
    },
    {
      icon: <Award size={24} />,
      title: 'Quality Assurance',
      description: 'Every candidate profile is verified and includes skill assessments and project portfolios.'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Smart Recommendations',
      description: 'Receive AI-powered candidate recommendations that best match your job requirements.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in under 2 minutes with your company details and get verified.'
    },
    {
      number: '02',
      title: 'Post Internships',
      description: 'Create detailed internship listings with requirements, responsibilities, and benefits.'
    },
    {
      number: '03',
      title: 'Review Applications',
      description: 'Browse AI-matched candidates, review profiles, and shortlist the best fits.'
    },
    {
      number: '04',
      title: 'Hire & Onboard',
      description: 'Connect with selected candidates, conduct interviews, and bring talent onboard.'
    }
  ];

  const stats = [
    { number: '250+', label: 'Companies Hiring' },
    { number: '100+', label: 'Interns Placed' },
    { number: '95%', label: 'Success Rate' },
    { number: '48hrs', label: 'Avg. Time to Hire' }
  ];

  const testimonials = [
    {
      company: 'Tech Startup Inc.',
      author: 'Priya Sharma, HR Manager',
      quote: 'I-Intern transformed our hiring process. We found skilled interns in just 3 days, saving us weeks of traditional recruitment.',
      rating: 5
    },
    {
      company: 'Digital Solutions Ltd.',
      author: 'Rahul Verma, CTO',
      quote: 'The quality of candidates is exceptional. The AI matching really works - every applicant we reviewed was a strong fit for our requirements.',
      rating: 5
    },
    {
      company: 'Innovation Labs',
      author: 'Ananya Desai, Founder',
      quote: 'Cost-effective, efficient, and reliable. We\'ve hired 5 interns through I-Intern and all of them exceeded our expectations.',
      rating: 5
    }
  ];

  return (
    <>
      <SEO
        title="Hire Interns | Find Top Talent with I-Intern"
        description="Discover how I-Intern helps companies hire skilled interns faster and more efficiently. AI-powered matching, verified candidates, and cost-effective recruitment."
        url="https://www.i-intern.com/hire-interns"
        image="https://www.i-intern.com/favicon.svg"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B3EDEB]/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-[#63D7C7]/20 backdrop-blur-sm rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[#B3EDEB] font-semibold">For Employers</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Hire <span className="text-[#63D7C7]">Top Talent</span><br />
              Build Your <span className="text-[#63D7C7]">Dream Team</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 text-white/90 leading-relaxed">
              Connect with India's brightest interns. Find skilled talent faster with AI-powered matching and verified candidate profiles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/company">
                <motion.button
                  className="bg-[#63D7C7] text-[#004F4D] px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg hover:bg-[#B3EDEB] transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/pricing?type=company">
                <motion.button
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#FFFAF3]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-[#1F7368] mb-2">{stat.number}</div>
                <div className="text-[#181C19]/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#1F7368] font-bold uppercase tracking-wide mb-4">Why Choose I-Intern</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
              Everything You Need to Hire Better
            </h2>
            <p className="text-xl text-[#181C19]/70 max-w-3xl mx-auto">
              From AI-powered matching to verified candidates, we've built the perfect platform for modern recruitment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-[#FFFAF3] p-8 rounded-2xl border-2 border-[#B3EDEB]/30 hover:border-[#63D7C7] hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-[#1F7368] mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-[#004F4D] mb-3">{benefit.title}</h3>
                <p className="text-[#181C19]/70 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#B3EDEB]/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#1F7368] font-bold uppercase tracking-wide mb-4">Simple Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
              Start Hiring in 4 Easy Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg h-full">
                  <div className="text-6xl font-bold text-[#63D7C7]/20 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-[#004F4D] mb-3">{step.title}</h3>
                  <p className="text-[#181C19]/70 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-[#63D7C7]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-[#1F7368] to-[#004F4D] text-white p-6 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FFFAF3]">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#1F7368] font-bold uppercase tracking-wide mb-4">Success Stories</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004F4D] mb-6">
              Trusted by Leading Companies
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircle key={i} size={20} className="text-[#63D7C7] fill-current" />
                  ))}
                </div>
                <p className="text-[#181C19] mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-[#004F4D]">{testimonial.author}</p>
                  <p className="text-[#181C19]/60 text-sm">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1F7368] to-[#004F4D] text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Build Your Team?
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Join 250+ companies already hiring top talent through I-Intern. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register/company">
                <motion.button
                  className="bg-[#63D7C7] text-[#004F4D] px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-[#B3EDEB] transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Hiring Now
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Sales
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HireInternsPage;
