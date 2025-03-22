import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Award, Plus, Save, Trash, X } from 'lucide-react';
import { SkillData } from '../../types';

const SkillsEditor: React.FC = () => {
  const { data, updateSkills } = useResume();
  const [skills, setSkills] = useState<SkillData[]>([...data.skills]);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'core' as 'core' | 'tool' });

  const handleAddSkill = () => {
    if (newSkill.name.trim() === '') return;
    
    const skill: SkillData = {
      id: `skill${Date.now()}`,
      name: newSkill.name,
      category: newSkill.category
    };
    
    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    updateSkills(updatedSkills);
    setNewSkill({ name: '', category: 'core' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    updateSkills(updatedSkills);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSkill({ ...newSkill, category: e.target.value as 'core' | 'tool' });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Skills & Tools</h1>
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Skills updated successfully!
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Add New Skill</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter skill name"
            />
          </div>
          <div>
            <select
              value={newSkill.category}
              onChange={handleCategoryChange}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="core">Core Skill</option>
              <option value="tool">Tool</option>
            </select>
          </div>
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Core Skills</h2>
          
          {skills.filter(s => s.category === 'core').length === 0 ? (
            <p className="text-gray-400 italic">No core skills added yet.</p>
          ) : (
            <div className="space-y-2">
              {skills
                .filter(skill => skill.category === 'core')
                .map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center bg-blue-500 bg-opacity-20 px-4 py-2 rounded">
                    <span className="text-blue-400">{skill.name}</span>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Tools</h2>
          
          {skills.filter(s => s.category === 'tool').length === 0 ? (
            <p className="text-gray-400 italic">No tools added yet.</p>
          ) : (
            <div className="space-y-2">
              {skills
                .filter(skill => skill.category === 'tool')
                .map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded">
                    <span className="text-gray-300">{skill.name}</span>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsEditor;