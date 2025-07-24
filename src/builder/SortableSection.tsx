import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionWidget from './SectionWidget';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
  id: string;
  section: any;
  isSelected: boolean;
  onSectionSelect: (section: any) => void;
  onOpenContentManager: (section: any) => void;
  onSectionDelete: (sectionId: number) => void;
  onRemoveContent: (contentId: number) => void;
  refreshKey: number;
}

export default function SortableSection({
  id,
  section,
  isSelected,
  onSectionSelect,
  onOpenContentManager,
  onSectionDelete,
  onRemoveContent,
  refreshKey
}: SortableSectionProps) {
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

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className="relative group"
    >
      <div 
        {...listeners}
        className="absolute left-2 top-2 z-10 p-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded shadow-sm"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      
      <SectionWidget
        section={section}
        isSelected={isSelected}
        onSectionSelect={onSectionSelect}
        onOpenContentManager={onOpenContentManager}
        onSectionDelete={onSectionDelete}
        onRemoveContent={onRemoveContent}
        refreshKey={refreshKey}
      />
    </div>
  );
} 
