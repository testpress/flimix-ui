import { getSectionTypes } from './sectionRegistry';

export default function SectionSidebar({ onDragStart, setIsSidebarDragging }: any) {
  // Get all available section types from the registry
  const sectionTypes = getSectionTypes();
  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Elements</h2>
        <div className="space-y-3">
          {sectionTypes.map((sectionTemplate: any) => {
            const IconComponent = sectionTemplate.icon;
            return (
              <div
                key={sectionTemplate.id}
                draggable
                onDragStart={e => {
                  onDragStart(e, sectionTemplate);
                  setIsSidebarDragging && setIsSidebarDragging(true);
                }}
                onDragEnd={() => setIsSidebarDragging && setIsSidebarDragging(false)}
                className="border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
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
          })}
        </div>
      </div>
    </div>
  );
} 