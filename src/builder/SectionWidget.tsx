import { useState, useEffect } from 'react';
import { endpoints } from './api';
import HeroSectionWidget from './HeroSectionWidget';
import CarouselSectionWidget from './CarouselSectionWidget';
import { Settings, Trash2 } from 'lucide-react';

interface SectionWidgetProps {
  section: any;
  isSelected: boolean;
  onSectionSelect: (section: any) => void;
  onOpenContentManager: (section: any) => void;
  onSectionDelete: (sectionId: number) => void;
  onRemoveContent: (contentId: number) => void;
  refreshKey?: number;
}

export default function SectionWidget({
  section,
  isSelected,
  onSectionSelect,
  onOpenContentManager,
  onSectionDelete,
  onRemoveContent,
  refreshKey = 0
}: SectionWidgetProps) {
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsContentLoading(true);
      try {
        const data = await endpoints.getSectionContent(section.section.id);
        setSectionContent(data);
      } catch (error) {
        console.error('Failed to fetch section content:', error);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchContent();
  }, [section.section.id, refreshKey]);

  const handleSectionClick = () => {
    onSectionSelect(section);
  };

  const handleOpenContentManager = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onOpenContentManager(section);
  };

  const handleDeleteSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSectionDelete(section.section.id);
  };

  const handleContentUpdate = async () => {
    try {
      const data = await endpoints.getSectionContent(section.section.id);
      setSectionContent(data);
    } catch (error) {
      console.error('Failed to refresh section content:', error);
    }
  };

  const renderSectionContent = () => {
    switch (section.section.section_type) {
      case 'hero':
        return (
          <HeroSectionWidget
            section={section}
            sectionContent={sectionContent}
            isSelected={isSelected}
            onOpenContentManager={handleOpenContentManager}
            isContentLoading={isContentLoading}
          />
        );
      case 'carousel':
        return (
          <CarouselSectionWidget
            section={section}
            sectionContent={sectionContent}
            isSelected={isSelected}
            onOpenContentManager={handleOpenContentManager}
            onRemoveContent={onRemoveContent}
            isContentLoading={isContentLoading}
            onContentUpdate={handleContentUpdate}
          />
        );
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-center">
            Unknown section type: {section.section.section_type}
          </div>
        );
    }
  };

  return (
    <div
      className="relative group cursor-pointer transition-all duration-200"
      onClick={handleSectionClick}
    >
      <div className="bg-gray-100 text-black p-2 flex items-center justify-between z-10 rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">{section.section.name}</span>
          {section.section.section_type === 'carousel' && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {sectionContent.length} items
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenContentManager}
            className="p-1 hover:bg-red-600 hover:text-white rounded flex items-center gap-1"
            title="Manage Content"
          >
            <Settings className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleDeleteSection}
            className="p-1 hover:bg-red-600 hover:text-white rounded"
            title="Delete Section"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="py-8 max-w-7xl mx-auto">
        {renderSectionContent()}
      </div>
    </div>
  );
}