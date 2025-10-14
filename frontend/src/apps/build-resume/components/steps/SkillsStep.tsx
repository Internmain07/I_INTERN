import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface SkillsStepProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SUGGESTED_SKILLS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML/CSS',
  'TypeScript', 'Git', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS',
  'Express.js', 'Next.js', 'Vue.js', 'Angular', 'Spring Boot',
  'Django', 'Flask', 'Redis', 'GraphQL', 'REST APIs', 'Linux',
  'Kubernetes', 'Jenkins', 'C++', 'C#', 'Go', 'Rust'
];

export const SkillsStep: React.FC<SkillsStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [skills, setSkills] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    onUpdate(skills);
  }, [skills, onUpdate]);

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills(prev => [...prev, skill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills</h2>
        <p className="text-gray-600">Add your technical skills and competencies</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-4 border border-gray-300 rounded-lg bg-gray-50">
          {skills.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primaryTeal text-white"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-accentTeal"
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill (e.g., React, Python, Git)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(newSkill);
              }
            }}
          />
          <motion.button
            onClick={() => addSkill(newSkill)}
            className="px-4 py-2 bg-primaryTeal text-white rounded-lg hover:bg-darkTeal transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggested Skills (click to add)
        </label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.filter(skill => !skills.includes(skill)).map((skill, index) => (
            <motion.button
              key={index}
              onClick={() => addSuggestedSkill(skill)}
              className="px-3 py-1 text-sm border border-accentTeal text-primaryTeal rounded-full hover:border-primaryTeal hover:text-darkTeal transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {skill}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          onClick={onPrev}
          className="px-6 py-3 border border-accentTeal text-primaryTeal rounded-lg hover:bg-aqua hover:text-darkTeal transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={onNext}
          className="px-6 py-3 bg-primaryTeal text-white rounded-lg hover:bg-darkTeal transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next Step
        </motion.button>
      </div>
    </motion.div>
  );
};


