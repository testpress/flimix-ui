import { useDraggable } from '@dnd-kit/core';
import { getWidgetDefinitions } from '../utils';
import type { WidgetData } from '../types';

interface DraggableWidgetProps {
  widget: {
    type: string;
    name: string;
    icon: string;
    defaultAttributes: Record<string, any>;
  };
}

function DraggableWidget({ widget }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `widget-${widget.type}`,
    data: {
      type: widget.type,
      attributes: widget.defaultAttributes
    } as WidgetData
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-4 mb-2 bg-white border border-gray-200 rounded-lg cursor-move
        hover:border-blue-500 hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{widget.icon}</span>
        <div>
          <div className="font-medium text-gray-900">{widget.name}</div>
          <div className="text-sm text-gray-500">{widget.type}</div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetPanel() {
  const widgetDefinitions = getWidgetDefinitions();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Widgets</h2>
        <p className="text-sm text-gray-600">Drag widgets to the canvas</p>
      </div>
      
      <div className="space-y-2">
        {widgetDefinitions.map((widget) => (
          <DraggableWidget key={widget.type} widget={widget} />
        ))}
      </div>
    </div>
  );
} 