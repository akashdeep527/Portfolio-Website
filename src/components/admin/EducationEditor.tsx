import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { GraduationCap, Plus, Save, Trash, Edit, X } from 'lucide-react';
import { EducationData } from '../../types';

const EducationEditor: React.FC = () => {
  const { data, updateEducation } = useResume();
  const [educations, setEducations] = useState<EducationData[]>([...data.education]);
  const [saved, setSaved] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    const newEdu: EducationData = {
      id: `edu${Date.now()}`,
      degree: '',
      institution: '',
      period: ''
    };
    setEditingEdu(newEdu);
    setIsEditing(true);
  };

  const handleEdit = (edu: EducationData) => {
    setEditingEdu({ ...edu });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducations = educations.filter(edu => edu.id !== id);
      setEducations(updatedEducations);
      updateEducation(updatedEducations);
    }
  };

  const handleEduChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingEdu) {
      setEditingEdu({ ...editingEdu, [name]: value });
    }
  };

  const handleSaveEdu = () => {
    if (editingEdu) {
      const eduIndex = educations.findIndex(e => e.id === editingEdu.id);
      let updatedEducations;
      
      if (eduIndex >= 0) {
        updatedEducations = [...educations];
        updatedEducations[eduIndex] = editingEdu;
      } else {
        updatedEducations = [...educations, editingEdu];
      }
      
      setEducations(updatedEducations);
      updateEducation(updatedEducations);
      setIsEditing(false);
      setEditingEdu(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingEdu(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Education</h1>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Plus size={18} />
            <span>Add Education</span>
          </button>
        )}
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Education updated successfully!
        </div>
      )}

      {isEditing && editingEdu ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingEdu.id.startsWith('edu') && !educations.find(e => e.id === editingEdu.id) 
              ? 'Add New Education' 
              : 'Edit Education'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="degree" className="block text-gray-300 mb-2">Degree/Certificate</label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={editingEdu.degree}
                onChange={handleEduChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="institution" className="block text-gray-300 mb-2">Institution</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={editingEdu.institution}
                onChange={handleEduChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="period" className="block text-gray-300 mb-2">Period</label>
              <input
                type="text"
                id="period"
                name="period"
                value={editingEdu.period}
                onChange={handleEduChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="MM/YYYY – MM/YYYY"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEdu}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              <Save size={18} />
              <span>Save Education</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {educations.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-400">No education entries added yet. Click "Add Education" to get started.</p>
            </div>
          ) : (
            educations.map((edu) => (
              <div key={edu.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                    <p className="text-gray-300">{edu.institution}</p>
                    <p className="text-gray-400">{edu.period}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EducationEditor;