import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Languages, Plus, Save, Trash } from 'lucide-react';

const LanguagesEditor: React.FC = () => {
  const { data, updateLanguages } = useResume();
  const [languages, setLanguages] = useState<string[]>([...data.languages]);
  const [newLanguage, setNewLanguage] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddLanguage = () => {
    if (newLanguage.trim() === '') return;
    if (languages.includes(newLanguage.trim())) {
      alert('This language is already in your list.');
      return;
    }
    
    const updatedLanguages = [...languages, newLanguage.trim()];
    setLanguages(updatedLanguages);
    updateLanguages(updatedLanguages);
    setNewLanguage('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteLanguage = (language: string) => {
    const updatedLanguages = languages.filter(lang => lang !== language);
    setLanguages(updatedLanguages);
    updateLanguages(updatedLanguages);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Languages className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Languages</h1>
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Languages updated successfully!
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Add New Language</h2>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter language"
            />
          </div>
          <button
            onClick={handleAddLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-white mb-4">Your Languages</h2>
        
        {languages.length === 0 ? (
          <p className="text-gray-400 italic">No languages added yet.</p>
        ) : (
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded">
                <span className="text-white">{language}</span>
                <button
                  onClick={() => handleDeleteLanguage(language)}
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
  );
};

export default LanguagesEditor;