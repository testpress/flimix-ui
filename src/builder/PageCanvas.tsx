import React, { useState } from 'react';
import SectionWidget from './SectionWidget';
import { Plus } from 'lucide-react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';

export default function PageCanvas({
  selectedLandingPage,
  setSelectedLandingPage,
  selectedSection,
  setSelectedSection,
  isSidebarDragging,
  handleSidebarDragOver,
  handleSidebarDrop,
  getSectionType,
  handleOpenContentManager,
  handleSectionDelete,
  handleRemoveContent,
  viewport
}: any) {
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [isSectionDragging, setIsSectionDragging] = useState(false);

  const handleSectionDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedSectionIndex(idx);
    setIsSectionDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleSectionDragOver = (e: React.DragEvent, _idx: number) => {
    e.preventDefault();
  };

  const handleSectionDrop = async (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === idx) return;
    if (!selectedLandingPage) return;
    const newOrder = [...selectedLandingPage.landingpagesection_set];
    const [moved] = newOrder.splice(draggedSectionIndex, 1);
    newOrder.splice(idx, 0, moved);
    setSelectedLandingPage({
      ...selectedLandingPage,
      landingpagesection_set: newOrder
    });
    setDraggedSectionIndex(null);
    setIsSectionDragging(false);
    try {
      const orderString = newOrder.map((s: any) => s.id).join(',');
      await endpoints.reorderLandingPageSections(selectedLandingPage.id, { section_order: orderString });
      toast.success('Section order updated!');
    } catch (err) {
      toast.error('Failed to update section order');
    }
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setIsSectionDragging(false);
  };

  return (
    <div
  className={`mx-auto transition-all duration-300 overflow-y-auto max-h-[calc(100vh-100px)] ${
    viewport === 'desktop' ? 'max-w-none w-full' :
    viewport === 'tablet' ? 'max-w-2xl border-x border-gray-200 mx-auto' :
    'max-w-sm border-x border-gray-200 mx-auto'
  }`}
>

      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {selectedLandingPage ? `${selectedLandingPage.name} - ${selectedLandingPage.landingpagesection_set?.length || 0} sections` : 'No page selected'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Drag elements from the sidebar to add them to your page</span>
        </div>
      </div>
      <div
        onDragOver={isSidebarDragging ? handleSidebarDragOver : undefined}
        onDrop={isSidebarDragging ? handleSidebarDrop : undefined}
      >
        <div className={`mx-auto transition-all duration-300 ${
          viewport === 'desktop' ? 'max-w-none w-full' :
          viewport === 'tablet' ? 'max-w-2xl border-x border-gray-200 mx-auto' :
          'max-w-sm border-x border-gray-200 mx-auto'
        }`}>
          {selectedLandingPage?.landingpagesection_set?.map((section: any, idx: number) => (
            <div
              key={section.section.id}
              draggable={true}
              onDragStart={(e) => handleSectionDragStart(e, idx)}
              onDragEnd={handleSectionDragEnd}
              onDragOver={(e) => handleSectionDragOver(e, idx)}
              onDrop={(e) => handleSectionDrop(e, idx)}
            >
              <SectionWidget
                section={section}
                isSelected={selectedSection?.section.id === section.section.id}
                template={getSectionType(section.section.section_type)}
                onSectionSelect={setSelectedSection}
                onOpenContentManager={handleOpenContentManager}
                onSectionDelete={handleSectionDelete}
                onRemoveContent={(contentId: number) => handleRemoveContent(section.section.id, contentId)}
                isSectionDragging={isSectionDragging}
              />
            </div>
          )) || (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg m-4">
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Drag elements here to build your page</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 