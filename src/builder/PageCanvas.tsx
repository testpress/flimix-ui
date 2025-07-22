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
  handleSidebarDrop,
  getSectionType,
  handleOpenContentManager,
  handleSectionDelete,
  handleRemoveContent,
  viewport,
  refreshKey
}: any) {
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [isSectionDragging, setIsSectionDragging] = useState(false);
  const [isDropTargetVisible, setIsDropTargetVisible] = useState(false);

  // Handle drag start for section reordering
  const handleSectionDragStart = (e: React.DragEvent, sectionIndex: number) => {
    setDraggedSectionIndex(sectionIndex);
    setIsSectionDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionIndex.toString());
  };

  // Allow dropping on section
  const handleSectionDragOver = (e: React.DragEvent, _sectionIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop for section reordering
  const handleSectionDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === dropIndex) return;
    if (!selectedLandingPage) return;

    const newSectionOrder = [...selectedLandingPage.landingpagesection_set];
    const [movedSection] = newSectionOrder.splice(draggedSectionIndex, 1);
    newSectionOrder.splice(dropIndex, 0, movedSection);
    
    setSelectedLandingPage({
      ...selectedLandingPage,
      landingpagesection_set: newSectionOrder
    });

    setDraggedSectionIndex(null);
    setIsSectionDragging(false);

    try {
      const orderString = newSectionOrder.map((section: any) => section.id).join(',');
      await endpoints.reorderLandingPageSections(selectedLandingPage.id, { section_order: orderString });
      toast.success('Section order updated!');
    } catch (err) {
      toast.error('Failed to update section order');
    }
  };

  // Handle drag end for section reordering
  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setIsSectionDragging(false);
  };

  // Handle drag over for canvas (for adding new sections)
  const handleCanvasDragOver = (e: React.DragEvent) => {
    if (isSidebarDragging) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDropTargetVisible(true);
    }
  };

  // Handle drag leave for canvas
  const handleCanvasDragLeave = () => {
    setIsDropTargetVisible(false);
  };

  // Handle drop for adding new section from sidebar
  const handleCanvasDrop = (e: React.DragEvent) => {
    if (isSidebarDragging) {
      e.preventDefault();
      setIsDropTargetVisible(false);
      handleSidebarDrop(e);
    }
  };

  const sectionList = selectedLandingPage?.landingpagesection_set || [];

  return (
    <div
      className={`mx-auto transition-all duration-300 overflow-y-auto max-h-[calc(100vh-100px)] ${
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
      {/* Drop area for new sections */}
      <div
        className="flex-1 overflow-y-auto"
        onDragOver={handleCanvasDragOver}
        onDragLeave={handleCanvasDragLeave}
        onDrop={handleCanvasDrop}
      >
        <div className={`mx-auto transition-all duration-300 ${
          viewport === 'desktop' ? 'max-w-none w-full' :
          viewport === 'tablet' ? 'max-w-2xl border-x border-gray-200 mx-auto' :
          'max-w-sm border-x border-gray-200 mx-auto'
        }`}>
          {sectionList.length > 0 ? (
            sectionList.map((section: any, sectionIndex: number) => (
              <div
                key={section.section.id}
                draggable={true}
                onDragStart={(e) => handleSectionDragStart(e, sectionIndex)}
                onDragEnd={handleSectionDragEnd}
                onDragOver={(e) => handleSectionDragOver(e, sectionIndex)}
                onDrop={(e) => handleSectionDrop(e, sectionIndex)}
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
                  refreshKey={refreshKey}
                />
              </div>
            ))
          ) : (
            <div className={`flex items-center justify-center h-64 border-2 border-dashed \
              ${isDropTargetVisible ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} \
              rounded-lg m-4 transition-colors duration-200`}
            >
              <div className="text-center">
                <Plus className={`h-8 w-8 mx-auto mb-2 ${isDropTargetVisible ? 'text-blue-400' : 'text-gray-400'}`} />
                <p className={`${isDropTargetVisible ? 'text-blue-600' : 'text-gray-600'}`}>\
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