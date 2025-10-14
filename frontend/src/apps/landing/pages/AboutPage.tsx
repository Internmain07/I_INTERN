import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion, Variants } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Lightbulb, 
  Users, 
  Target, 
  Globe, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  MessageCircle, 
  Award,
  Rocket,
  Eye,
  Heart
} from 'lucide-react';

// NOTE FOR YOUR PROJECT:
// To use these colors cleanly, add them to your `tailwind.config.js` file:
/*
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1F7368',     // Deep Teal
        'brand-secondary': '#63D7C7',    // Aqua Mint
        'brand-tertiary': '#004F4D',    // Dark Teal
        'brand-accent': '#B3EDEB',      // Balanced Mint
        'brand-black': '#181C19',       // Black
        'brand-neutral': '#FFFAF3',     // Cream White
      },
    },
  },
*/

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

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

// --- Data for sections (unchanged) ---
const coreValues = [
  { icon: Shield, title: "Integrity", description: "Transparent, fair, and honest interactions always." },
  { icon: Zap, title: "Empowerment", description: "Enabling interns and employers to unlock their full potential." },
  { icon: Lightbulb, title: "Innovation", description: "Pioneering AI-powered tools for smarter hiring." },
  { icon: Users, title: "Collaboration", description: "Fostering partnerships that nurture talent and ideas." },
];

const features = [
  { icon: Globe, title: "Diverse Opportunities", description: "Access a vast array of internships across multiple industries and domains." },
  { icon: Target, title: "AI-Powered Matchmaking", description: "Our intelligent algorithms precisely match the right candidates to the right roles." },
  { icon: Lock, title: "Secure & Modern Platform", description: "A robust, scalable platform designed with digital natives in mind." },
  { icon: Sparkles, title: "Seamless Experience", description: "Enjoy real-time notifications and streamlined applications from start to finish." },
  { icon: MessageCircle, title: "Direct Engagement", description: "Facilitating direct communication to foster genuine connections." },
  { icon: TrendingUp, title: "Career-Oriented Support", description: "We focus on driving meaningful outcomes and long-term growth for every user." },
];

const team = [
  { name: "Rahul Balaskandan", role: "Founder & CEO", bio: "Rahul is the visionary leading I-Intern’s mission, driving innovation and shaping business strategy to fuel growth and investor confidence.", color: "bg-teal-500", imageUrl: "https://placehold.co/200x200/1F7368/FFFAF3?text=RB" },
  { name: "Deepakumar", role: "Co-founder & CTO", bio: "Deepakumar is the driving force behind I-Intern’s technological backbone, focused on scalability, resilience, and engineering excellence.", color: "bg-cyan-500", imageUrl: "https://placehold.co/200x200/004F4D/FFFAF3?text=DK" },
  { name: "Sanjay Nesan J", role: "Chief Frontend & Design Officer", bio: "Sanjay leads I-Intern’s design strategy, crafting a seamless, intuitive, and visually engaging user experience for our platform.", color: "bg-emerald-500", imageUrl: "https://placehold.co/200x200/1F7368/FFFAF3?text=SN" },
  { name: "Sanjay S", role: "Chief AI Architect", bio: "Sanjay is the architect of A.U.R.A, our AI-powered skill verification system that drives smarter, faster, and fairer hiring processes.", color: "bg-sky-500", imageUrl: "https://placehold.co/200x200/004F4D/FFFAF3?text=SS" },
];

const faqs = [
    { q: "What types of internships can I find on I-Intern?", a: "I-Intern offers a wide variety of internships across tech, marketing, finance, design, and more, from startups to established corporations. Our AI helps you find the perfect fit for your skills and career goals." },
    { q: "How does the AI matchmaking work?", a: "Our intelligent platform analyzes your profile, skills, and preferences to recommend internships where you are most likely to succeed and thrive, saving you time and effort in your search." },
    { 
      q: "Is the platform free for students?", 
      a: "Yes, I-Intern is completely free for students. Our goal is to remove barriers to entry and provide equal access to career-launching opportunities for everyone. We offer a Free Plan (₹0/month) with 5 credits per month (reset on 1st), where 1 credit = 1 internship application. There's a 10%–20% success fee on paid internships. For unlimited applications, we also offer a Premium Plan at ₹198/month with unlimited internship applications, no success fee on stipend, AI-powered resume builder, personalized skill assessments, priority placement in searches, and access to premium opportunities." 
    },
];

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About I-Intern | Gateway to Internships & Talent"
        description="Learn about I-Intern, the next-generation platform connecting ambitious students with forward-thinking employers for transformative internship experiences."
        url="https://www.i-intern.com/about"
        image="https://www.i-intern.com/favicon.svg"
      />
      <Navbar />
      <div className="bg-[#FFFAF3] text-[#181C19] font-sans overflow-x-hidden">
        {/* Header Section */}
        <header className="relative bg-[#004F4D] text-[#FFFAF3] py-24 sm:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F7368] to-[#004F4D] opacity-80"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-3/4 h-3/4 bg-[#63D7C7]/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -top-1/2 -right-1/4 w-3/4 h-3/4 bg-[#1F7368]/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
          
          <motion.div 
            className="relative container mx-auto px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
              Welcome to <span className="text-[#63D7C7]">I-Intern</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-[#B3EDEB]">
              We're bridging the gap between ambitious students and the world's most innovative companies.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <div className="inline-block bg-[#63D7C7]/20 backdrop-blur-sm text-[#B3EDEB] font-semibold px-6 py-3 rounded-full">
                Empowering Tomorrow's Talent
              </div>
            </motion.div>
          </motion.div>
        </header>

        <main>
          {/* Mission & Vision Section */}
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-6">
              <motion.div 
                className="grid md:grid-cols-2 gap-8 lg:gap-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={staggerContainer}
              >
                <motion.div variants={scaleIn} className="bg-white p-8 rounded-2xl shadow-lg border border-[#B3EDEB] hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#004F4D]">Our Mission</h3>
                  </div>
                  <p className="mt-4 text-[#181C19]/90">To streamline the internship ecosystem by providing <strong className="text-[#1F7368]">equal opportunity access</strong>, <strong className="text-[#1F7368]">intelligent matchmaking</strong>, and a <strong className="text-[#1F7368]">secure, user-centric experience</strong> for all.</p>
                </motion.div>
                <motion.div variants={scaleIn} className="bg-white p-8 rounded-2xl shadow-lg border border-[#B3EDEB] hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#004F4D]">Our Vision</h3>
                  </div>
                  <p className="mt-4 text-[#181C19]/90">To become the <strong className="text-[#1F7368]">world's most trusted AI powered internship platform</strong> — empowering every intern to gain indispensable industry experience and every organization to discover untapped potential.</p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="bg-[#B3EDEB] py-16 sm:py-24">
            <motion.div 
              className="container mx-auto px-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="font-bold text-[#1F7368] uppercase tracking-wider">Our Principles</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-[#004F4D] mt-2">Our Core Values</motion.h2>
              <motion.div 
                className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
              >
                {coreValues.map((value) => (
                  <motion.div key={value.title} variants={fadeInUp} className="bg-[#FFFAF3] p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1F7368] to-[#004F4D] text-white rounded-xl mb-6 shadow-lg">
                      <value.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#004F4D]">{value.title}</h3>
                    <p className="mt-2 text-[#181C19]/80">{value.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Why Choose Section */}
          <section className="py-16 sm:py-24">
            <motion.div 
              className="container mx-auto px-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <div className="text-center">
                <motion.p variants={fadeInUp} className="font-bold text-[#1F7368] uppercase tracking-wider">Our Advantage</motion.p>
                <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-[#004F4D] mt-2">Why Choose I-Intern?</motion.h2>
              </div>
              <motion.div 
                className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-x-8 gap-y-12"
                variants={staggerContainer}
              >
                {features.map((feature) => (
                  <motion.div key={feature.title} variants={fadeInUp} className="relative flex flex-col items-center text-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#63D7C7] to-[#1F7368] text-white shadow-lg">
                        <feature.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl leading-6 font-bold text-[#004F4D]">{feature.title}</h3>
                      <p className="mt-2 text-base text-[#181C19]/80">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
          
          {/* Team Section */}
          <section className="bg-[#B3EDEB] py-16 sm:py-24">
            <motion.div 
              className="container mx-auto px-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-8 h-8 text-[#1F7368]" />
                <p className="font-bold text-[#1F7368] uppercase tracking-wider">Our Team</p>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-[#004F4D] mt-2">Meet the Visionaries</motion.h2>
              <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
              >
                {team.map((member) => (
                  <motion.div key={member.name} variants={fadeInUp} className="bg-[#FFFAF3] rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
                    <img className="w-24 h-24 mx-auto rounded-full object-cover" src={member.imageUrl} alt={`Profile picture of ${member.name}`} />
                    <h3 className="mt-4 text-xl font-bold text-[#004F4D]">{member.name}</h3>
                    <p className="mt-1 text-[#1F7368] font-semibold">{member.role}</p>
                    <p className="mt-3 text-sm text-[#181C19]/80 text-left">{member.bio}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 sm:py-24">
            <motion.div 
              className="container mx-auto px-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
                <div className="text-center mb-12">
                    <motion.p variants={fadeInUp} className="font-bold text-[#1F7368] uppercase tracking-wider">Questions?</motion.p>
                    <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-[#004F4D] mt-2">Frequently Asked Questions</motion.h2>
                </div>
                <motion.div 
                  className="max-w-3xl mx-auto space-y-4"
                  variants={staggerContainer}
                >
                    {faqs.map((faq, index) => (
                        <motion.details variants={fadeInUp} key={index} className="p-6 border border-[#B3EDEB] rounded-lg bg-white group" open={index === 0}>
                            <summary className="font-semibold text-lg text-[#004F4D] cursor-pointer flex justify-between items-center">
                                {faq.q}
                                <svg className="w-5 h-5 transform transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </summary>
                            <p className="mt-4 text-[#181C19]/80">{faq.a}</p>
                        </motion.details>
                    ))}
                </motion.div>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#004F4D]">
            <div className="container mx-auto px-6 py-16 sm:py-24">
              <motion.div 
                className="relative bg-gradient-to-r from-[#1F7368] to-[#63D7C7] rounded-3xl overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={scaleIn}
              >
                  <div className="relative text-center p-12 lg:p-16">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <Heart className="w-10 h-10 text-white fill-white" />
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Launch Your Journey?</h2>
                      </div>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-[#FFFAF3]">
                          Whether you're an intern seeking opportunity or a company searching for talent, your journey starts here.
                      </p>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                          <Link to="/register/student" className="inline-block bg-[#FFFAF3] text-[#1F7368] font-bold py-3 px-8 rounded-full text-lg hover:bg-[#B3EDEB] transform hover:scale-105 transition-all duration-300">Register as Intern</Link>
                          <Link to="/register/company" className="inline-block bg-[#63D7C7] text-[#004F4D] font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">Register as Employer</Link>
                      </div>
                  </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;


