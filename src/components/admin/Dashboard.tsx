import React from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import { Eye, RefreshCw, User, Briefcase, GraduationCap, Award, Languages } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, resetData } = useResume();
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This action cannot be undone.')) {
      resetData();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm sm:text-base"
          >
            <Eye size={18} />
            <span>View Resume</span>
          </Link>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm sm:text-base"
          >
            <RefreshCw size={18} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Profile</h2>
          </div>
          <p className="text-gray-300 mb-4">Your personal information and profile description.</p>
          <Link 
            to="/admin/profile"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Edit Profile
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Experience</h2>
          </div>
          <p className="text-gray-300 mb-4">{data.experience.length} work experiences listed.</p>
          <Link 
            to="/admin/experience"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Edit Experience
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Education</h2>
          </div>
          <p className="text-gray-300 mb-4">{data.education.length} education entries listed.</p>
          <Link 
            to="/admin/education"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Edit Education
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Skills</h2>
          </div>
          <p className="text-gray-300 mb-4">{data.skills.length} skills and tools listed.</p>
          <Link 
            to="/admin/skills"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Edit Skills
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Languages</h2>
          </div>
          <p className="text-gray-300 mb-4">{data.languages.length} languages listed.</p>
          <Link 
            to="/admin/languages"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Edit Languages
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Use the sidebar to navigate between different sections of your resume.</li>
          <li>Click on "View Resume" to see your changes in real-time.</li>
          <li>All changes are automatically saved to your browser's local storage.</li>
          <li>Use the "Reset Data" button to restore all default content if needed.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;