import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';
import { Plus, X, Search, Grid, List, Move } from 'lucide-react';

export default function ContentManager({ section, onContentUpdate }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<any>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: movies = [] } = useQuery({
    queryKey: ['movies'],
    queryFn: endpoints.movies,
  });
  const { data: series = [] } = useQuery({
    queryKey: ['series'],
    queryFn: endpoints.series,
  });
  const { data: sectionContent = [] } = useQuery({
    queryKey: ['section-content', section.id],
    queryFn: () => endpoints.getSectionContent(section.id),
  });

  const addContentMutation = useMutation({
    mutationFn: ({ sectionId, data }: any) => endpoints.addContentToSection(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['section-content', section.id] });
      queryClient.invalidateQueries({ queryKey: ['page-data'] });
      toast.success('Content added to section!');
      onContentUpdate();
    },
    onError: () => toast.error('Failed to add content')
  });

  const removeContentMutation = useMutation({
    mutationFn: ({ sectionId, itemId }: any) => endpoints.removeContentFromSection(sectionId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['section-content', section.id] });
      queryClient.invalidateQueries({ queryKey: ['page-data'] });
      toast.success('Content removed from section!');
      onContentUpdate();
    },
    onError: () => toast.error('Failed to remove content')
  });

  const handleAddContent = async (content: any) => {
    const data = {
      content_type: content.type,
      content_id: content.id
    };
    if (section.section_type === 'hero' && sectionContent.length >= 1) {
      await removeContentMutation.mutateAsync({ sectionId: section.id, itemId: sectionContent[0].id });
    }
    addContentMutation.mutate({ sectionId: section.id, data });
  };

  const handleRemoveContent = (itemId: number) => {
    removeContentMutation.mutate({ sectionId: section.id, itemId });
  };

  const handleDragStart = (e: React.DragEvent, content: any) => {
    setIsDragging(true);
    setDragData(content);
    e.dataTransfer.setData('application/json', JSON.stringify(content));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragData(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragOverTarget(null);
    try {
      const content = JSON.parse(e.dataTransfer.getData('application/json'));
      handleAddContent(content);
    } catch (error) {
      toast.error('Failed to add content');
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTarget('section');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  };

  const allContent = [
    ...movies.map((movie: any) => ({ ...movie, type: 'movie' })),
    ...series.map((series: any) => ({ ...series, type: 'series' }))
  ];

  const filteredContent = allContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = contentType === 'all' || content.type === contentType;
    return matchesSearch && matchesType;
  });

  const isHeroSectionWithContent = section.section_type === 'hero' && sectionContent.length >= 1;

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-900 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Content</option>
              <option value="movie">Movies Only</option>
              <option value="series">Series Only</option>
            </select>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid className="h-4 w-4 bg-black" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="h-4 w-4 bg-black" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Found {filteredContent.length} items • Drag to add to section
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredContent.map((content: any) => (
                <div
                  key={`${content.type}-${content.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, content)}
                  onDragEnd={handleDragEnd}
                  className="border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="relative">
                    <img
                      src={content.poster_url || 'https://placehold.co/200x300?text=No+Image'}
                      alt={content.title}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x300?text=No+Image'; }}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Move className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 truncate">{content.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">{content.type}</span>
                    {isHeroSectionWithContent ? null : (
                      <button
                        onClick={() => handleAddContent(content)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContent.map((content: any) => (
                <div
                  key={`${content.type}-${content.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, content)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <img
                    src={content.poster_url || 'https://placehold.co/100x150?text=No+Image'}
                    alt={content.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x150?text=No+Image'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{content.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{content.description}</p>
                    <span className="text-xs text-gray-400 capitalize">{content.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Move className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isHeroSectionWithContent ? null : (
                      <button
                        onClick={() => handleAddContent(content)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Section Content</h3>
          <p className="text-sm text-gray-600">
            Content in this section • Drag to reorder
          </p>
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`flex-1 overflow-y-auto p-4 transition-all duration-200 ${
            dragOverTarget === 'section' ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
          }`}
        >
          {sectionContent && sectionContent.length > 0 ? (
            <div className="space-y-3">
              {sectionContent.map((item: any) => {
                const content = item.content || {};
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={content.poster_url || 'https://placehold.co/60x80?text=No+Image'}
                      alt={content.title || 'Content'}
                      className="w-12 h-16 object-cover rounded"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x80?text=No+Image'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{content.title || 'Untitled'}</h4>
                      <p className="text-xs text-gray-500 truncate">{content.description || 'No description'}</p>
                      <span className="text-xs text-gray-400 capitalize">{item.content_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRemoveContent(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`flex items-center justify-center h-full transition-all duration-200 ${
              dragOverTarget === 'section' ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' : ''
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {dragOverTarget === 'section' ? (
                    <Move className="h-8 w-8 text-blue-500" />
                  ) : (
                    <Plus className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {dragOverTarget === 'section' ? 'Drop here to add content' : 'No content yet'}
                </h3>
                <p className="text-gray-600">
                  {dragOverTarget === 'section'
                    ? 'Release to add content to this section'
                    : 'Drag content from the left panel to add it to this section'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isDragging && dragData && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-dashed border-blue-500">
            <div className="flex items-center gap-3">
              <img
                src={dragData.poster_url || 'https://placehold.co/40x60?text=No+Image'}
                alt={dragData.title}
                className="w-10 h-15 object-cover rounded"
              />
              <div>
                <span className="font-medium">{dragData.title}</span>
                <span className="text-sm text-gray-500 capitalize ml-2">({dragData.type})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 