import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { Project } from '../../types/resume';
import { FormInput } from '../FormInput';
import { FormTextarea } from '../FormTextarea';

interface ProjectsStepProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ProjectsStep: React.FC<ProjectsStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [projects, setProjects] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    onUpdate(projects);
  }, [projects, onUpdate]);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      techStack: [],
      githubLink: '',
    };
    setProjects(prev => [...prev, newProject]);
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const addSkillToProject = (projectId: string, skill: string) => {
    if (skill.trim()) {
      updateProject(projectId, 'techStack', [
        ...projects.find(p => p.id === projectId)?.techStack || [],
        skill.trim(),
      ]);
    }
  };

  const removeSkillFromProject = (projectId: string, skillToRemove: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        'techStack',
        project.techStack.filter(skill => skill !== skillToRemove)
      );
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Projects</h2>
        <p className="text-gray-600">Showcase your best projects and achievements</p>
      </div>

      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg border-2 border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Project {index + 1}
              </h3>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  value={project.title}
                  onChange={(value) => updateProject(project.id, 'title', value)}
                  placeholder="E-commerce Website"
                  required
                />
                <FormInput
                  label="GitHub Link"
                  type="url"
                  value={project.githubLink}
                  onChange={(value) => updateProject(project.id, 'githubLink', value)}
                  placeholder="https://github.com/username/project"
                />
              </div>

              <FormTextarea
                label="Description"
                value={project.description}
                onChange={(value) => updateProject(project.id, 'description', value)}
                placeholder="Describe your project, its features, and your role in it..."
                required
                rows={3}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.techStack.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkillFromProject(project.id, skill)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkillToProject(project.id, newSkill);
                        setNewSkill('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      addSkillToProject(project.id, newSkill);
                      setNewSkill('');
                    }}
                    className="px-4 py-2 bg-primaryTeal text-white rounded-lg hover:bg-darkTeal transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={addProject}
        className="w-full py-3 border-2 border-dashed border-accentTeal rounded-lg text-primaryTeal hover:border-primaryTeal hover:text-darkTeal transition-colors duration-200 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={20} />
        Add Project
      </motion.button>

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


