import { getSectionTypes } from './sectionRegistry';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface SectionTemplateProps {
  sectionTemplate: any;
  onDragStart: (template: any) => void;
  onDragEnd: () => void;
}

function DraggableSectionTemplate({ sectionTemplate, onDragStart, onDragEnd }: SectionTemplateProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `template-${sectionTemplate.id}`,
    data: sectionTemplate
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const IconComponent = sectionTemplate.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
      onDragStart={() => onDragStart(sectionTemplate)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3 mb-2">
        <IconComponent className="h-5 w-5" />
        <h3 className="font-medium text-gray-900">{sectionTemplate.name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{sectionTemplate.description}</p>
      <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
        <span className="text-gray-500 text-sm">{sectionTemplate.name}</span>
      </div>
    </div>
  );
}

export default function SectionSidebar({ onDragStart, setIsSidebarDragging }: any) {
  const sectionTypes = getSectionTypes();
  
  const handleDragStart = (template: any) => {
    setIsSidebarDragging && setIsSidebarDragging(true);
    onDragStart && onDragStart({ target: { dataset: { template: JSON.stringify(template) } } }, template);
  };
  
  const handleDragEnd = () => {
    setIsSidebarDragging && setIsSidebarDragging(false);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Elements</h2>
        <div className="space-y-3">
          {sectionTypes.map((sectionTemplate: any) => (
            <DraggableSectionTemplate
              key={sectionTemplate.id}
              sectionTemplate={sectionTemplate}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 