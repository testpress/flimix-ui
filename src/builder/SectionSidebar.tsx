import { getSectionTypes } from './sectionRegistry';

export default function SectionSidebar({ onDragStart, setIsSidebarDragging }: any) {
  const sectionTypes = getSectionTypes();
  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Elements</h2>
        <div className="space-y-3">
          {sectionTypes.map((template: any) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                draggable
                onDragStart={e => {
                  onDragStart(e, template);
                  setIsSidebarDragging && setIsSidebarDragging(true);
                }}
                onDragEnd={() => setIsSidebarDragging && setIsSidebarDragging(false)}
                className="border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5" />
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{template.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 