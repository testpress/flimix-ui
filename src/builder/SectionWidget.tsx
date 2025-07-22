import { useState, useEffect } from 'react';
import { endpoints } from './api';
import HeroSectionWidget from './HeroSectionWidget';
import CarouselSectionWidget from './CarouselSectionWidget';
import { Settings } from 'lucide-react';

export default function SectionWidget({
  section,
  isSelected,
  onSectionSelect,
  onOpenContentManager,
  onSectionDelete,
  onRemoveContent,
  refreshKey = 0
}: any) {
  const [sectionContent, setSectionContent] = useState<any[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  // Fetch section content when section or refreshKey changes
  useEffect(() => {
    setIsContentLoading(true);
    endpoints.getSectionContent(section.section.id).then((data) => {
      setSectionContent(data);
      setIsContentLoading(false);
    });
  }, [section.section.id, refreshKey]);

  // Render the correct widget for this section type
  const renderSectionContent = () => {
    switch (section.section.section_type) {
      case 'hero':
        return (
          <HeroSectionWidget
            section={section}
            sectionContent={sectionContent}
            isSelected={isSelected}
            onOpenContentManager={onOpenContentManager}
            isContentLoading={isContentLoading}
          />
        );
      case 'carousel':
        return (
          <CarouselSectionWidget
            section={section}
            sectionContent={sectionContent}
            isSelected={isSelected}
            onOpenContentManager={onOpenContentManager}
            onRemoveContent={onRemoveContent}
            isContentLoading={isContentLoading}
            onContentUpdate={() => {
              setIsContentLoading(true);
              endpoints.getSectionContent(section.section.id).then((data) => {
                setSectionContent(data);
                setIsContentLoading(false);
              });
            }}
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
      className={`relative group cursor-pointer transition-all duration-200`}
      onClick={() => onSectionSelect(section)}
    >
      <div className="bg-gray-100 text-black p-2 flex items-center justify-between z-10 rounded-t-lg">
        <span className="text-sm font-medium text-gray-900">{section.section.name}</span>
        <div className="flex items-center gap-1">
          {section.section.section_type === 'hero' && (
            <button
              onClick={e => {
                e.stopPropagation();
                onOpenContentManager(section);
              }}
              className="p-1 hover:bg-gray-700 rounded flex items-center gap-1"
              title="Manage Content"
            >
              <Settings className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSectionDelete(section.section.id);
            }}
            className="p-1 hover:bg-red-600 hover:text-white rounded"
          >
            ×
          </button>
        </div>
      </div>
      <div className="py-8 max-w-7xl mx-auto">
        {renderSectionContent()}
      </div>
    </div>
  );
}