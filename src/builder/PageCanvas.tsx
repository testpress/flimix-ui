import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';

interface PageCanvasProps {
  selectedLandingPage: any;
  setSelectedLandingPage: (page: any) => void;
  selectedSection: any;
  setSelectedSection: (section: any) => void;
  isSidebarDragging: boolean;
  handleOpenContentManager: (section: any) => void;
  handleSectionDelete: (sectionId: number) => void;
  handleRemoveContent: (sectionId: number, contentId: number) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  refreshKey: number;
}

export default function PageCanvas({
  selectedLandingPage,
  setSelectedLandingPage,
  selectedSection,
  setSelectedSection,
  isSidebarDragging,
  handleOpenContentManager,
  handleSectionDelete,
  handleRemoveContent,
  viewport,
  refreshKey
}: PageCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas-drop-area',
  });

  const [isDropTargetVisible, setIsDropTargetVisible] = useState(false);
  
  useEffect(() => {
    setIsDropTargetVisible(isOver && isSidebarDragging);
  }, [isOver, isSidebarDragging]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    if (!active.id.toString().startsWith('section-')) {
      return;
    }

    if (!selectedLandingPage) return;

    const oldIndex = parseInt(active.id.toString().split('-')[1]);
    const newIndex = parseInt(over.id.toString().split('-')[1]);
    
    const newSectionOrder = [...selectedLandingPage.landingpagesection_set];
    const reorderedSections = arrayMove(newSectionOrder, oldIndex, newIndex);
    
    setSelectedLandingPage({
      ...selectedLandingPage,
      landingpagesection_set: reorderedSections
    });

    try {
      const orderString = reorderedSections.map((section: any) => section.id).join(',');
      await endpoints.reorderLandingPageSections(selectedLandingPage.id, { section_order: orderString });
      toast.success('Section order updated!');
    } catch (err) {
      toast.error('Failed to update section order');
    }
  };

  const sectionList = selectedLandingPage?.landingpagesection_set || [];
  const sectionIds = sectionList.map((_: any, index: number) => `section-${index}`);

  return (
    <div
      className={`mx-auto transition-all duration-300 overflow-y-auto max-h-[calc(100vh-100px)] relative z-10 ${
        viewport === 'desktop' ? 'max-w-none w-full' :
        viewport === 'tablet' ? 'max-w-2xl border-x border-gray-200 mx-auto' :
        'max-w-sm border-x border-gray-200 mx-auto'
      }`}
    >
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedLandingPage
            ? `${selectedLandingPage.name} - ${sectionList.length} sections`
            : 'No page selected'}
        </span>
        <span className="text-sm text-gray-600">
          Drag elements from the sidebar to add them to your page
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div 
          ref={setDroppableRef}
          className={`mx-auto transition-all duration-300 relative ${
            viewport === 'desktop' ? 'max-w-none w-full' :
            viewport === 'tablet' ? 'max-w-2xl border-x border-gray-200 mx-auto' :
            'max-w-sm border-x border-gray-200 mx-auto'
          }`}
        >
          {sectionList.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                {sectionList.map((section: any, sectionIndex: number) => (
                  <SortableSection
                    key={`section-${sectionIndex}`}
                    id={`section-${sectionIndex}`}
                    section={section}
                    isSelected={selectedSection?.section.id === section.section.id}
                    onSectionSelect={setSelectedSection}
                    onOpenContentManager={handleOpenContentManager}
                    onSectionDelete={handleSectionDelete}
                    onRemoveContent={(contentId: number) => handleRemoveContent(section.section.id, contentId)}
                    refreshKey={refreshKey}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className={`flex items-center justify-center h-64 border-2 border-dashed \
              ${isDropTargetVisible ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} \
              rounded-lg m-4 transition-colors duration-200`}
            >
              <div className="text-center">
                <Plus className={`h-8 w-8 mx-auto mb-2 ${isDropTargetVisible ? 'text-blue-400' : 'text-gray-400'}`} />
                <p className={`${isDropTargetVisible ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isDropTargetVisible ? 'Drop here to add section' : 'Drag elements here to build your page'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 