import { Plus } from 'lucide-react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableCarouselItem from './SortableCarouselItem';

interface CarouselSectionWidgetProps {
  section: any;
  sectionContent: any[];
  isSelected: boolean;
  onOpenContentManager: (e?: React.MouseEvent) => void;
  onRemoveContent: (contentId: number) => void;
  isContentLoading: boolean;
  onContentUpdate: () => void;
}

export default function CarouselSectionWidget({
  section,
  sectionContent = [],
  onOpenContentManager,
  onRemoveContent,
  isContentLoading,
  onContentUpdate
}: CarouselSectionWidgetProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenContentManager = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onOpenContentManager(e);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = parseInt(active.id.toString().split('-')[1]);
    const newIndex = parseInt(over.id.toString().split('-')[1]);
    
    const newContentOrder = [...sectionContent];
    const reorderedContent = arrayMove(newContentOrder, oldIndex, newIndex);
    
    try {
      const orderString = reorderedContent.map((item: any) => item.id).join(',');
      await endpoints.reorderSectionContent(section.section.id, { content_order: orderString });
      toast.success('Content order updated!');
      if (onContentUpdate) onContentUpdate();
    } catch (error) {
      toast.error('Failed to update content order');
    }
  };

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

  const contentIds = sectionContent.map((_: any, index: number) => `content-${index}`);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {isContentLoading ? (
          <div className="flex items-center justify-center h-32 w-full text-gray-400">Loading...</div>
        ) : sectionContent.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={contentIds}
              strategy={horizontalListSortingStrategy}
            >
              {sectionContent.map((item: any, contentIndex: number) => (
                <SortableCarouselItem
                  key={`content-${contentIndex}`}
                  id={`content-${contentIndex}`}
                  item={item}
                  onRemove={() => handleRemoveContentItem(item.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex-shrink-0 w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <button
              type="button"
              onClick={handleOpenContentManager}
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