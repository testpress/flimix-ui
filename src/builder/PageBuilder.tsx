import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  setIsPreviewMode: (v: boolean) => void;
}

export default function PageBuilder({ setIsPreviewMode }: PageBuilderProps) {
  const [selectedLandingPage, setSelectedLandingPage] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isPreviewMode, setIsPreviewModeLocal] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showContentManager, setShowContentManager] = useState(false);
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const queryClient = useQueryClient();

  // Sync local state with parent state
  const handlePreviewModeChange = (value: boolean) => {
    setIsPreviewModeLocal(value);
    setIsPreviewMode(value);
  };

  const { data: landingPages = [], isLoading } = useQuery({
    queryKey: ['landing-pages'],
    queryFn: endpoints.landingPages,
  });

  const createSectionMutation = useMutation({
    mutationFn: (data: any) => endpoints.createSection(data),
    onSuccess: (newSection) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section created successfully!');
      return newSection;
    },
    onError: () => toast.error('Failed to create section')
  });

  const addSectionToLandingPageMutation = useMutation({
    mutationFn: ({ landingPageId, sectionId }: any) => endpoints.addSectionToLandingPage(landingPageId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Section added to page!');
    },
    onError: () => toast.error('Failed to add section to page')
  });

  const removeContentMutation = useMutation({
    mutationFn: ({ sectionId, itemId }: any) => endpoints.removeContentFromSection(sectionId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Content removed from section!');
    },
    onError: () => toast.error('Failed to remove content')
  });

  const removeSectionFromLandingPageMutation = useMutation({
    mutationFn: ({ landingPageId, sectionId }: any) => endpoints.removeSectionFromLandingPage(landingPageId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Section removed from page!');
    },
    onError: () => toast.error('Failed to remove section from page')
  });

  const handleDragStart = (e: React.DragEvent, template: any) => {
    const { icon, ...serializableTemplate } = template;
    e.dataTransfer.setData('application/json', JSON.stringify(serializableTemplate));
  };

  const handleSectionDelete = (sectionId: number) => {
    if (!selectedLandingPage) return;
    const previousLandingPage = selectedLandingPage;
    const updatedLandingPage = {
      ...selectedLandingPage,
      landingpagesection_set: selectedLandingPage.landingpagesection_set.filter(
        (lpSection: any) => lpSection.section.id !== sectionId
      )
    };
    setSelectedLandingPage(updatedLandingPage);
    removeSectionFromLandingPageMutation.mutate({
      landingPageId: selectedLandingPage.id,
      sectionId
    }, {
      onError: () => {
        setSelectedLandingPage(previousLandingPage);
      }
    });
    setSelectedSection(null);
  };

  const handleSectionUpdate = (sectionId: number, updates: any) => {
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
  };

  const handleOpenContentManager = (section: any) => {
    setSelectedSection(section);
    setShowContentManager(true);
  };

  const handleContentUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    setShowContentManager(false);
  };

  const handleRemoveContent = (sectionId: number, contentId: number) => {
    removeContentMutation.mutate({ sectionId, itemId: contentId });
  };

  const handleSidebarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleSidebarDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsSidebarDragging(false);
    const template = JSON.parse(e.dataTransfer.getData('application/json'));
    if (!selectedLandingPage) {
      toast.error('Please select a landing page first');
      return;
    }
    try {
      const newSection = await createSectionMutation.mutateAsync({
        name: template.name,
        section_type: template.id,
        content_selection_type: 'manual'
      });
      await addSectionToLandingPageMutation.mutateAsync({
        landingPageId: selectedLandingPage.id,
        sectionId: newSection.id
      });
      const landingPages = await queryClient.fetchQuery({
        queryKey: ['landing-pages'],
        queryFn: endpoints.landingPages,
      });
      const updated = (landingPages as any[]).find(lp => lp.id === selectedLandingPage.id);
      setSelectedLandingPage(updated);
      toast.success('Section added!');
    } catch (error) {
      toast.error('Failed to add section');
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
        {!isPreviewMode && (
          <CanvasToolbar
            viewport={viewport}
            setViewport={setViewport}
            isPreviewMode={isPreviewMode}
            setIsPreviewMode={handlePreviewModeChange}
          />
        )}
      </div>
      <div className="flex-1 flex">
        {!isPreviewMode && (
          <SectionSidebar onDragStart={handleDragStart} setIsSidebarDragging={setIsSidebarDragging} />
        )}
        <PageCanvas
          selectedLandingPage={selectedLandingPage}
          setSelectedLandingPage={setSelectedLandingPage}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          isSidebarDragging={isSidebarDragging}
          handleSidebarDragOver={handleSidebarDragOver}
          handleSidebarDrop={handleSidebarDrop}
          getSectionType={getSectionType}
          handleOpenContentManager={handleOpenContentManager}
          handleSectionDelete={handleSectionDelete}
          handleRemoveContent={handleRemoveContent}
          viewport={viewport}
        />
        {!isPreviewMode && selectedSection && (
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
      {showContentManager && selectedSection && (
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
                onClick={() => setShowContentManager(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentManager
                section={selectedSection.section}
                sectionName={selectedSection.section.name}
                onClose={() => setShowContentManager(false)}
                onContentUpdate={handleContentUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 