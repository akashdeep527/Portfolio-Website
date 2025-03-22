import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Gauge, Plus, Save, Trash, Edit, X } from 'lucide-react';
import { StatData } from '../../types';

const StatsEditor: React.FC = () => {
  const { data, updateStats } = useResume();
  const [stats, setStats] = useState<StatData[]>([...data.stats]);
  const [saved, setSaved] = useState(false);
  const [editingStat, setEditingStat] = useState<StatData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    const newStat: StatData = {
      id: `stat${Date.now()}`,
      value: '',
      label: '',
      icon: 'Gauge'
    };
    setEditingStat(newStat);
    setIsEditing(true);
  };

  const handleEdit = (stat: StatData) => {
    setEditingStat({ ...stat });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      const updatedStats = stats.filter(stat => stat.id !== id);
      setStats(updatedStats);
      updateStats(updatedStats);
    }
  };

  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingStat) {
      setEditingStat({ ...editingStat, [name]: value });
    }
  };

  const handleSaveStat = () => {
    if (editingStat) {
      const statIndex = stats.findIndex(s => s.id === editingStat.id);
      let updatedStats;
      
      if (statIndex >= 0) {
        updatedStats = [...stats];
        updatedStats[statIndex] = editingStat;
      } else {
        updatedStats = [...stats, editingStat];
      }
      
      setStats(updatedStats);
      updateStats(updatedStats);
      setIsEditing(false);
      setEditingStat(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingStat(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Gauge className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Stats</h1>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <Plus size={18} />
            <span>Add Stat</span>
          </button>
        )}
      </div>

      {saved && (
        <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded mb-6">
          Stats updated successfully!
        </div>
      )}

      {isEditing && editingStat ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingStat.id.startsWith('stat') && !stats.find(s => s.id === editingStat.id) 
              ? 'Add New Stat' 
              : 'Edit Stat'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="value" className="block text-gray-300 mb-2">Value</label>
              <input
                type="text"
                id="value"
                name="value"
                value={editingStat.value}
                onChange={handleStatChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="e.g., 95%, 150+, 30%"
                required
              />
            </div>
            <div>
              <label htmlFor="label" className="block text-gray-300 mb-2">Label</label>
              <input
                type="text"
                id="label"
                name="label"
                value={editingStat.label}
                onChange={handleStatChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="e.g., Compliance Accuracy"
                required
              />
            </div>
            <div>
              <label htmlFor="icon" className="block text-gray-300 mb-2">Icon</label>
              <select
                id="icon"
                name="icon"
                value={editingStat.icon}
                onChange={handleStatChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              >
                <option value="Gauge">Gauge</option>
                <option value="Target">Target</option>
                <option value="Tool">Tool</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveStat}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              <Save size={18} />
              <span>Save Stat</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.length === 0 ? (
            <div className="col-span-3 bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-400">No stats added yet. Click "Add Stat" to get started.</p>
            </div>
          ) : (
            stats.map((stat) => (
              <div key={stat.id} className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-end mb-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(stat)}
                      className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {stat.icon === 'Gauge' && <Gauge className="w-12 h-12 text-blue-400 mb-4" />}
                  {stat.icon === 'Target' && <Gauge className="w-12 h-12 text-blue-400 mb-4" />}
                  {stat.icon === 'Tool' && <Gauge className="w-12 h-12 text-blue-400 mb-4" />}
                  <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StatsEditor;