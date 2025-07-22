import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';

export default function SectionProperties({ section, onUpdate }: any) {
  const [name, setName] = useState(section.section.name || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    setName(section.section.name || "");
  }, [section.section.id, section.section.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onUpdate({ name: newName });
  };

  const updateSectionNameMutation = useMutation({
    mutationFn: ({ id, data }: any) => endpoints.updateSectionName(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section name updated!');
    },
    onError: () => toast.error('Failed to update section name')
  });

  const handleSave = () => {
    updateSectionNameMutation.mutate({ id: section.section.id, data: { name } });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Section Name
        </label>
        <input
          type="text"
          value={name}
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