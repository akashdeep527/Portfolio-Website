import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Briefcase, Plus, Save, Trash, Edit, X } from 'lucide-react';
import { ExperienceData } from '../../types';

const ExperienceEditor: React.FC = () => {
  const { data, updateExperience } = useResume();
  const [experiences, setExperiences] = useState<ExperienceData[]>([...data.experience]);
  const [saved, setSaved] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    const newExp: ExperienceData = {
      id: `exp${Date.now()}`,
      company: '',
      position: '',
      period: '',
      challenges: []
    };
    setEditingExp(newExp);
    setIsEditing(true);
  };

  const handleEdit = (exp: ExperienceData) => {
    setEditingExp({ ...exp });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      setExperiences(updatedExperiences);
      updateExperience(updatedExperiences);
    }
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingExp) {
      setEditingExp({ ...editingExp, [name]: value });
    }
  };

  const handleAddChallenge = () => {
    if (editingExp) {
      const newChallenge = {
        id: `challenge${Date.now()}`,
        challenge: '',
        result: ''
      };
      setEditingExp({
        ...editingExp,
        challenges: [...editingExp.challenges, newChallenge]
      });
    }
  };

  const handleChallengeChange = (id: string, field: 'challenge' | 'result', value: string) => {
    if (editingExp) {
      const updatedChallenges = editingExp.challenges.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      );
      setEditingExp({ ...editingExp, challenges: updatedChallenges });
    }
  };

  const handleDeleteChallenge = (id: string) => {
    if (editingExp) {
      const updatedChallenges = editingExp.challenges.filter(c => c.id !== id);
      setEditingExp({ ...editingExp, challenges: updatedChallenges });
    }
  };

  const handleSaveExp = () => {
    if (editingExp) {
      const expIndex = experiences.findIndex(e => e.id === editingExp.id);
      let updatedExperiences;
      
      if (expIndex >= 0) {
        updatedExperiences = [...experiences];
        updatedExperiences[expIndex] = editingExp;
      } else {
        updatedExperiences = [...experiences, editingExp];
      }
      
      setExperiences(updatedExperiences);
      updateExperience(updatedExperiences);
      setIsEditing(false);
      setEditingExp(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingExp(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Experience</h1>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            <Plus size={16} />
            Add Experience
          </button>
        )}
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Experience updated successfully!
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                  <p className="text-gray-300">{exp.company} | {exp.period}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    <Edit size={16} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    <Trash size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
              
              {exp.challenges.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-md font-semibold text-gray-300 mb-2">Challenges & Results</h4>
                  <ul className="space-y-2">
                    {exp.challenges.map(c => (
                      <li key={c.id} className="bg-gray-700 p-3 rounded">
                        <div className="text-white">{c.challenge}</div>
                        {c.result && (
                          <div className="text-green-400 mt-1">
                            <span className="font-medium">Result:</span> {c.result}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No experiences added yet. Click "Add Experience" to get started.
            </div>
          )}

          {saved && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <Save size={16} />
              Changes saved successfully!
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingExp?.id.startsWith('exp') && !experiences.some(e => e.id === editingExp.id)
              ? 'Add New Experience'
              : 'Edit Experience'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={editingExp?.company || ''}
                onChange={handleExpChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                placeholder="Company name"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={editingExp?.position || ''}
                onChange={handleExpChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                placeholder="Your job title"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Period</label>
              <input
                type="text"
                name="period"
                value={editingExp?.period || ''}
                onChange={handleExpChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                placeholder="e.g. Jan 2020 - Present"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-300">Challenges & Results</label>
                <button
                  onClick={handleAddChallenge}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              
              {editingExp?.challenges.map(c => (
                <div key={c.id} className="bg-gray-700 p-3 rounded mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-gray-300">Challenge</label>
                    <button
                      onClick={() => handleDeleteChallenge(c.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={c.challenge}
                    onChange={(e) => handleChallengeChange(c.id, 'challenge', e.target.value)}
                    className="w-full bg-gray-600 text-white p-2 rounded-md mb-2"
                    placeholder="Describe the challenge"
                  />
                  
                  <label className="block text-gray-300 mb-1">Result</label>
                  <input
                    type="text"
                    value={c.result}
                    onChange={(e) => handleChallengeChange(c.id, 'result', e.target.value)}
                    className="w-full bg-gray-600 text-white p-2 rounded-md"
                    placeholder="Describe the outcome"
                  />
                </div>
              ))}
              
              {editingExp?.challenges.length === 0 && (
                <div className="text-center text-gray-400 py-4 bg-gray-700 rounded-md">
                  No challenges added yet. Click "Add" to include challenges you faced.
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExp}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor;