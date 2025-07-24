import { useState, useEffect } from 'react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';

export default function SectionProperties({ section, onUpdate }: any) {
  const [sectionName, setSectionName] = useState(section.section.name || "");

  // Update local state if section changes
  useEffect(() => {
    setSectionName(section.section.name || "");
  }, [section.section.id, section.section.name]);

  // Handle input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(e.target.value);
  };

  // Save the new section name
  const handleSave = async () => {
    try {
      await endpoints.updateSectionName(section.section.id, { name: sectionName });
      toast.success('Section name updated!');
      onUpdate({ name: sectionName });
    } catch {
      toast.error('Failed to update section name');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Section Name
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
} 