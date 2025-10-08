import React, { useState, useEffect, useRef } from 'react';
// import { InternshipCarousel } from './InternshipCarousel'; // Temporarily hidden
import { motion, useAnimation, useInView } from 'framer-motion';
import { apiClient } from '@/api'; // This now correctly imports your configured client

interface Stat {
  label: string;
  value: string;
}

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ from, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });

      let startTime: number;
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(from + (to - from) * progress));
          requestAnimationFrame(animateCount);
        } else {
          setCount(to);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [inView, from, to, duration, controls]);

  return (
    <motion.span
      ref={ref}
      animate={controls}
      initial={{ opacity: 0 }}
    >
      {count.toLocaleString()}
    </motion.span>
  );
};

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Internships Posted', value: '250+' },
    { label: 'Companies Registered', value: '20+' },
    { label: 'Interns Joined', value: '100+' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This call now works correctly for both local and production environments
        const { data } = await apiClient.get('/api/v1/landing/stats');

        // Helper function to round numbers nicely
        const roundNumber = (num: number): string => {
          if (num >= 1000) {
            return `${Math.floor(num / 100) * 100}+`;
          } else if (num >= 100) {
            return `${Math.floor(num / 50) * 50}+`;
          } else if (num >= 10) {
            return `${Math.floor(num / 10) * 10}+`;
          } else {
            return `${num}+`;
          }
        };

        // Use real data if it exceeds mock data, otherwise use mock data
        const internshipsValue = data.internships_posted > 250
          ? roundNumber(data.internships_posted)
          : '250+';

        const companiesValue = data.companies_registered > 20
          ? roundNumber(data.companies_registered)
          : '20+';

        const internsValue = data.students_placed > 100
          ? roundNumber(data.students_placed)
          : '100+';

        const formattedStats = [
          { label: 'Internships Posted', value: internshipsValue },
          { label: 'Companies Registered', value: companiesValue },
          { label: 'Interns Joined', value: internsValue },
        ];

        setStats(formattedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep fallback data if API fails
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <section className="py-20 bg-[#1F7368]">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join those who have already found success through I-Intern
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-[#63D7C7] p-8 rounded-2xl text-center shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                viewport={{ once: true }}
              >
                <div className="text-5xl lg:text-6xl font-bold text-[#004F4D] mb-4">
                  <AnimatedCounter
                    from={0}
                    to={parseInt((stat.value || '0').replace(/[+,]/g, ''))}
                    duration={2.5}
                  />
                  {(stat.value || '').includes('+') && '+'}
                </div>
                <div className="text-xl font-semibold text-[#004F4D]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Temporarily hidden - Available Internships section */}
      {/* <div className="w-full flex justify-center bg-[#F8F9FA] py-12">
        <div className="w-full max-w-6xl">
          <InternshipCarousel />
        </div>
      </div> */}
    </>
  );
};