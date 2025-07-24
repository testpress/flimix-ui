import { useState, useEffect } from 'react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';
import ContentManager from './ContentManager';
import SectionSidebar from './SectionSidebar';
import SectionProperties from './SectionProperties';
import LandingPageSelector from './LandingPageSelector';
import CanvasToolbar from './CanvasToolbar';
import PageCanvas from './PageCanvas';
import { 
  DndContext, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface PageBuilderProps {
  setIsPreviewMode: (isPreview: boolean) => void;
  onPageUpdate?: () => void;
}

export default function PageBuilder({ setIsPreviewMode, onPageUpdate }: PageBuilderProps) {
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [selectedLandingPage, setSelectedLandingPage] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isLocalPreviewMode, setIsLocalPreviewMode] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const loadLandingPages = async () => {
      try {
        const pages = await endpoints.landingPages();
        setLandingPages(pages);
      } catch (error) {
        console.error('Failed to load landing pages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLandingPages();
  }, []);

  const handlePreviewModeChange = (isPreview: boolean) => {
    setIsLocalPreviewMode(isPreview);
    setIsPreviewMode(isPreview);
    if (isPreview && onPageUpdate) {
      onPageUpdate();
    }
  };

  const handleSectionTemplateDragStart = () => {
    setIsSidebarDragging(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    
    if (active.id.toString().startsWith('template-')) {
      setActiveDragData(active.data.current);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setIsSidebarDragging(false);
    setActiveDragId(null);
    setActiveDragData(null);
    
    if (!over) return;
    
    if (active.id.toString().startsWith('template-') && over.id === 'canvas-drop-area') {
      if (!selectedLandingPage) {
        toast.error('Please select a landing page first');
        return;
      }

      try {
        const sectionTemplate = active.data.current as { name: string; id: string };
        if (!sectionTemplate) {
          toast.error('Invalid section template data');
          return;
        }
        
        const newSection = await endpoints.createSection({
          name: sectionTemplate.name,
          section_type: sectionTemplate.id,
          content_selection_type: 'manual'
        });
        await endpoints.addSectionToLandingPage(selectedLandingPage.id, newSection.id);
        await refreshLandingPages();
        toast.success('Section added!');
        if (onPageUpdate) onPageUpdate();
      } catch (error) {
        toast.error('Failed to add section');
      }
    }
  };

  const refreshLandingPages = async (currentLandingPageId?: number) => {
    try {
      const updatedLandingPages = await endpoints.landingPages();
      setLandingPages(updatedLandingPages);
      const updatedSelected = updatedLandingPages.find(lp => lp.id === (currentLandingPageId || selectedLandingPage?.id));
      if (updatedSelected) setSelectedLandingPage(updatedSelected);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Failed to refresh landing pages:', error);
    }
  };

  const handleSectionDelete = async (sectionId: number) => {
    if (!selectedLandingPage) return;

    try {
      await endpoints.removeSectionFromLandingPage(selectedLandingPage.id, sectionId);
      
      const updatedLandingPage = {
        ...selectedLandingPage,
        landingpagesection_set: selectedLandingPage.landingpagesection_set.filter(
          (lpSection: any) => lpSection.section.id !== sectionId
        )
      };
      
      if (selectedSection?.section.id === sectionId) {
        setSelectedSection(null);
      }
      
      setSelectedLandingPage(updatedLandingPage);
      toast.success('Section removed from page!');
      await refreshLandingPages();
      if (onPageUpdate) onPageUpdate();
    } catch (error) {
      toast.error('Failed to remove section from page');
    }
  };

  const handleSectionUpdate = async (sectionId: number, updates: any) => {
    if (!selectedLandingPage) return;
    
    try {
      await endpoints.updateSection(sectionId, updates);
      
      const updatedLandingPage = {
        ...selectedLandingPage,
        landingpagesection_set: selectedLandingPage.landingpagesection_set.map((lpSection: any) => {
          if (lpSection.section.id === sectionId) {
            return {
              ...lpSection,
              section: {
                ...lpSection.section,
                ...updates
              }
            };
          }
          return lpSection;
        })
      };
      
      setSelectedLandingPage(updatedLandingPage);
      
      if (selectedSection && selectedSection.section.id === sectionId) {
        setSelectedSection({
          ...selectedSection,
          section: {
            ...selectedSection.section,
            ...updates
          }
        });
      }
      
      await refreshLandingPages();
      toast.success('Section updated!');
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const handleOpenContentManager = (section: any) => {
    setSelectedSection(section);
    setIsContentManagerOpen(true);
  };

  const handleContentUpdate = async () => {
    setIsContentManagerOpen(false);
    setRefreshKey(prevKey => prevKey + 1);
    await refreshLandingPages();
    if (onPageUpdate) onPageUpdate();
  };

  const handleRemoveContent = async (sectionId: number, contentId: number) => {
    if (!selectedLandingPage) return;

    try {
      await endpoints.removeContentFromSection(sectionId, contentId);
      
      if (selectedSection && selectedSection.section.id === sectionId) {
        setSelectedSection({
          ...selectedSection,
          sectionContent: (selectedSection.sectionContent || []).filter(
            (item: any) => item.id !== contentId
          )
        });
      }
      
      toast.success('Content removed from section!');
      setRefreshKey(prevKey => prevKey + 1);
      await refreshLandingPages();
      if (onPageUpdate) onPageUpdate();
    } catch (error) {
      toast.error('Failed to remove content');
    }
  };

  useEffect(() => {
    if (selectedLandingPage?.id) {
      localStorage.setItem('selectedLandingPageId', selectedLandingPage.id);
    }
  }, [selectedLandingPage]);

  useEffect(() => {
    const savedId = localStorage.getItem('selectedLandingPageId');
    if (savedId && landingPages.length > 0) {
      const found = landingPages.find((lp: any) => lp.id === parseInt(savedId));
      if (found) setSelectedLandingPage(found);
    }
  }, [landingPages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Page Builder</h1>
          <LandingPageSelector
            landingPages={landingPages}
            selectedLandingPage={selectedLandingPage}
            setSelectedLandingPage={setSelectedLandingPage}
          />
        </div>
        {!isLocalPreviewMode && (
          <CanvasToolbar
            viewport={viewport}
            setViewport={setViewport}
            isPreviewMode={isLocalPreviewMode}
            setIsPreviewMode={handlePreviewModeChange}
          />
        )}
      </div>
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex">
          {!isLocalPreviewMode && (
            <SectionSidebar onDragStart={handleSectionTemplateDragStart} setIsSidebarDragging={setIsSidebarDragging} />
          )}
          <PageCanvas
            selectedLandingPage={selectedLandingPage}
            setSelectedLandingPage={setSelectedLandingPage}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            isSidebarDragging={isSidebarDragging}
            handleOpenContentManager={handleOpenContentManager}
            handleSectionDelete={handleSectionDelete}
            handleRemoveContent={handleRemoveContent}
            viewport={viewport}
            refreshKey={refreshKey}
          />
          {!isLocalPreviewMode && selectedSection && (
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
                <SectionProperties
                  section={selectedSection}
                  onUpdate={(updates: any) => handleSectionUpdate(selectedSection.section.id, updates)}
                />
              </div>
            </div>
          )}
        </div>
        
        <DragOverlay zIndex={9999}>
          {activeDragId && activeDragId.toString().startsWith('template-') && activeDragData ? (
            <div className="border border-blue-300 rounded-lg p-3 bg-white shadow-xl opacity-90 transform rotate-3">
              <div className="flex items-center gap-3 mb-2">
                {activeDragData.icon && <activeDragData.icon className="h-5 w-5 text-blue-600" />}
                <h3 className="font-medium text-gray-900">{activeDragData.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{activeDragData.description}</p>
              <div className="w-full h-20 bg-blue-50 rounded border border-blue-200 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{activeDragData.name}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {isContentManagerOpen && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Content - {selectedSection.section.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add, remove, and reorder movies and series in this section
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsContentManagerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentManager
                section={selectedSection.section}
                onContentUpdate={handleContentUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 