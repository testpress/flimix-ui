import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';

interface SortableCarouselItemProps {
  id: string;
  item: any;
  onRemove: () => void;
}

export default function SortableCarouselItem({ id, item, onRemove }: SortableCarouselItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className="flex-shrink-0 w-48 relative group"
    >
      {/* Drag handle - only this area should be draggable */}
      <div 
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70 rounded"
        title="Drag to reorder"
      >
        <GripVertical className="h-3 w-3 text-white" />
      </div>
      
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
            type="button"
            onClick={handleRemove}
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
  );
} 