import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WidgetData } from '../types';
import WidgetRenderer from '../WidgetRenderer';

interface CanvasWidgetProps {
  widget: WidgetData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WidgetData>) => void;
  onDelete: () => void;
}

export default function CanvasWidget({
  widget,
  isSelected,
  onSelect,
  onDelete
}: CanvasWidgetProps) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Widget Controls */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            title="Delete widget"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Widget Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <WidgetRenderer widget={widget} />
      </div>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded-lg" />
      )}
    </div>
  );
} 