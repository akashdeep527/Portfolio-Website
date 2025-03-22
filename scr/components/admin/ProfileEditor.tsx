import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { User, Save } from 'lucide-react';

const ProfileEditor: React.FC = () => {
  const { data, updateProfile } = useResume();
  const [profile, setProfile] = useState({ ...data.profile });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Profile Information</h1>
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2">Professional Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={profile.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-300 mb-2">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-300 mb-2">Profile Description</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;