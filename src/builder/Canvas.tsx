import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { PageLayout, WidgetData } from '../types';
import CanvasWidget from './CanvasWidget';

interface CanvasProps {
  pageLayout: PageLayout;
  selectedWidget: WidgetData | null;
  onWidgetSelect: (widget: WidgetData | null) => void;
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetData>) => void;
  onWidgetDelete: (widgetId: string) => void;
}

export default function Canvas({
  pageLayout,
  selectedWidget,
  onWidgetSelect,
  onWidgetUpdate,
  onWidgetDelete
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div
        ref={setNodeRef}
        className={`
          min-h-full p-6
          ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}
        `}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Page Builder</h1>
            <p className="text-gray-600">Drag widgets here to build your page</p>
          </div>
          
          {pageLayout.children.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets yet</h3>
              <p className="text-gray-600">Drag widgets from the left panel to get started</p>
            </div>
          ) : (
            <SortableContext items={pageLayout.children.map(w => w.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {pageLayout.children.map((widget) => (
                  <CanvasWidget
                    key={widget.id}
                    widget={widget}
                    isSelected={selectedWidget?.id === widget.id}
                    onSelect={() => onWidgetSelect(widget)}
                    onUpdate={(updates: Partial<WidgetData>) => onWidgetUpdate(widget.id, updates)}
                    onDelete={() => onWidgetDelete(widget.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
} 