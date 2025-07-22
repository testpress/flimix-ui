import { useState } from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';

export default function CarouselSectionWidget({
  section,
  sectionContent = [],
  onOpenContentManager,
  onRemoveContent,
  isContentLoading,
  onContentUpdate
}: any) {
  // State for the index of the content item being dragged
  const [draggedContentIndex, setDraggedContentIndex] = useState<number | null>(null);

  // Handle drag start for content reordering
  const handleContentDragStart = (contentIndex: number) => {
    setDraggedContentIndex(contentIndex);
  };

  // Allow dropping on content
  const handleContentDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop for content reordering
  const handleContentDrop = async (dropIndex: number) => {
    if (draggedContentIndex === null || draggedContentIndex === dropIndex) return;

    const newContentOrder = [...sectionContent];
    const [movedContent] = newContentOrder.splice(draggedContentIndex, 1);

    newContentOrder.splice(dropIndex, 0, movedContent);
    const orderString = newContentOrder.map((item: any) => item.id).join(',');

    try {
      await endpoints.reorderSectionContent(section.section.id, { content_order: orderString });
      toast.success('Content order updated!');
      setDraggedContentIndex(null);
      if (onContentUpdate) onContentUpdate();
    } catch (error) {
      toast.error('Failed to update content order');
    }
    
  };

  // Handle removing a content item
  const handleRemoveContentItem = async (contentId: number) => {
    try {
      if (onRemoveContent) {
        onRemoveContent(contentId);
      } else {
        await endpoints.removeContentFromSection(section.section.id, contentId);
        toast.success('Content removed');
        if (onContentUpdate) onContentUpdate();
      }
    } catch (error) {
      toast.error('Failed to remove content');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{section.section.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{sectionContent.length} items</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenContentManager(section);
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Manage Content"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {isContentLoading ? (
          <div className="flex items-center justify-center h-32 w-full text-gray-400">Loading...</div>
        ) : sectionContent.length > 0 ? (
          sectionContent.map((item: any, contentIndex: number) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleContentDragStart(contentIndex)}
              onDragOver={handleContentDragOver}
              onDrop={() => handleContentDrop(contentIndex)}
              className="flex-shrink-0 w-48 relative group"
            >
              <div className="rounded-lg overflow-hidden shadow-md transition-all duration-200 transform group-hover:shadow-xl group-hover:-translate-y-1">
                <img
                  src={item.content?.poster_url || 'https://placehold.co/200x300?text=No+Image'}
                  alt={item.content?.title}
                  className="w-full h-64 object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x300?text=No+Image'; }}
                />
                <div className="p-3 bg-white">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{item.content?.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">{item.content?.type}</span>
                    <span className="text-xs text-gray-500">
                      {item.content?.release_year}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveContentItem(item.id);
                    }}
                    className="mt-2 w-full text-red-500 text-xs hover:text-red-700 flex items-center justify-center gap-1 py-1 border border-red-200 rounded hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {item.content?.duration_minutes ? `${item.content.duration_minutes} min` : 
                 item.content?.seasons ? `${item.content.seasons} seasons` : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenContentManager(section);
              }}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Movies/Series
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 