import type { WidgetData } from '../types';

interface PropertiesPanelProps {
  selectedWidget: WidgetData | null;
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetData>) => void;
}

export default function PropertiesPanel({ selectedWidget, onWidgetUpdate }: PropertiesPanelProps) {
  if (!selectedWidget) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Properties</h3>
          <p className="text-gray-600">Select a widget to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleAttributeChange = (key: string, value: any) => {
    onWidgetUpdate(selectedWidget.id, {
      attributes: {
        ...selectedWidget.attributes,
        [key]: value
      }
    });
  };

  const renderAttributeInput = (key: string, value: any) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

    if (typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => handleAttributeChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderAttributeInput(`${key}.${subKey}`, subValue)
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => handleAttributeChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Properties</h2>
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            <span className="font-medium">Type:</span> {selectedWidget.type}
          </div>
          <div>
            <span className="font-medium">ID:</span> {selectedWidget.id}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Attributes</h3>
        {Object.entries(selectedWidget.attributes).map(([key, value]) =>
          renderAttributeInput(key, value)
        )}
      </div>
    </div>
  );
} 