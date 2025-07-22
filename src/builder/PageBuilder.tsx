import { useState, useEffect } from 'react';
import { endpoints } from './api';
import { toast } from 'react-hot-toast';
import ContentManager from './ContentManager';
import SectionSidebar from './SectionSidebar';
import SectionProperties from './SectionProperties';
import { getSectionType } from './sectionRegistry';
import LandingPageSelector from './LandingPageSelector';
import CanvasToolbar from './CanvasToolbar';
import PageCanvas from './PageCanvas';

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

  // Load landing pages on mount
  useEffect(() => {
    endpoints.landingPages().then((pages) => {
      setLandingPages(pages);
      setIsLoading(false);
    });
  }, []);

  // Sync local preview mode with parent
  const handlePreviewModeChange = (isPreview: boolean) => {
    setIsLocalPreviewMode(isPreview);
    setIsPreviewMode(isPreview);
    if (isPreview && onPageUpdate) {
      onPageUpdate();
    }
  };

  // Handle drag start for section templates
  const handleSectionTemplateDragStart = (e: React.DragEvent, sectionTemplate: any) => {
    const { icon, ...serializableTemplate } = sectionTemplate;
    e.dataTransfer.setData('application/json', JSON.stringify(serializableTemplate));
  };

  // Refresh landing pages and update selectedLandingPage
  const refreshLandingPages = async (currentLandingPageId?: number) => {
    const updatedLandingPages = await endpoints.landingPages();
    setLandingPages(updatedLandingPages);
    const updatedSelected = updatedLandingPages.find(lp => lp.id === (currentLandingPageId || selectedLandingPage?.id));
    if (updatedSelected) setSelectedLandingPage(updatedSelected);
    setRefreshKey(prevKey => prevKey + 1); 
  };

  // Handle section deletion
  const handleSectionDelete = async (sectionId: number) => {
    if (!selectedLandingPage) return;
    const previousLandingPage = selectedLandingPage;
    const updatedLandingPage = {
      ...selectedLandingPage,
      landingpagesection_set: selectedLandingPage.landingpagesection_set.filter(
        (lpSection: any) => lpSection.section.id !== sectionId
      )
    };
    setSelectedLandingPage(updatedLandingPage);
    try {
      await endpoints.removeSectionFromLandingPage(selectedLandingPage.id, sectionId);
      toast.success('Section removed from page!');
      await refreshLandingPages();
      if (onPageUpdate) onPageUpdate();
    } catch {
      setSelectedLandingPage(previousLandingPage);
      toast.error('Failed to remove section from page');
    }
    setSelectedSection(null);
  };

  // Handle section update (e.g., name change)
  const handleSectionUpdate = async (sectionId: number, updates: any) => {
    if (!selectedLandingPage) return;
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
    try {
      await endpoints.updateSection(sectionId, updates);
      await refreshLandingPages();
    } catch {}
  };

  // Open content manager modal for a section
  const handleOpenContentManager = (section: any) => {
    setSelectedSection(section);
    setIsContentManagerOpen(true);
  };

  // Handle content update in modal
  const handleContentUpdate = async () => {
    setIsContentManagerOpen(false);
    await refreshLandingPages();
    if (onPageUpdate) onPageUpdate();
  };

  // Remove content from a section
  const handleRemoveContent = async (sectionId: number, contentId: number) => {
    if (selectedLandingPage) {
      if (selectedSection && selectedSection.section.id === sectionId) {
        setSelectedSection({
          ...selectedSection,
          sectionContent: (selectedSection.sectionContent || []).filter(
            (item: any) => item.id !== contentId
          )
        });
      }
      try {
        await endpoints.removeContentFromSection(sectionId, contentId);
        await refreshLandingPages();
        toast.success('Content removed from section!');
        setRefreshKey(prevKey => prevKey + 1);
        if (onPageUpdate) onPageUpdate();
      } catch {
        toast.error('Failed to remove content');
      }
    }
  };

  // Handle drop from sidebar to canvas
  const handleSidebarDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsSidebarDragging(false);
    let sectionTemplate;
    try {
      sectionTemplate = JSON.parse(e.dataTransfer.getData('application/json'));
    } catch (error) {
      toast.error('Invalid section data');
      return;
    }
    if (!selectedLandingPage) {
      toast.error('Please select a landing page first');
      return;
    }
    try {
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
  };

  // Persist selected landing page in localStorage
  useEffect(() => {
    if (selectedLandingPage?.id) {
      localStorage.setItem('selectedLandingPageId', selectedLandingPage.id);
    }
  }, [selectedLandingPage]);

  // Restore selected landing page from localStorage
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
      {/* Top Toolbar */}
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
          handleSidebarDrop={handleSidebarDrop}
          getSectionType={getSectionType}
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
                onClick={() => setIsContentManagerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentManager
                section={selectedSection.section}
                sectionName={selectedSection.section.name}
                onClose={() => setIsContentManagerOpen(false)}
                onContentUpdate={handleContentUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 