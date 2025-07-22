import { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { PageLayout, WidgetData } from '../types';
import WidgetPanel from './WidgetPanel';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { generateId } from '../utils';

const defaultPageLayout: PageLayout = {
  type: 'page',
  children: []
};

export default function PageBuilder() {
  const [pageLayout, setPageLayout] = useState<PageLayout>(defaultPageLayout);
  const [selectedWidget, setSelectedWidget] = useState<WidgetData | null>(null);
  const [activeWidget, setActiveWidget] = useState<WidgetData | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const widgetData = active.data.current as WidgetData;
    setActiveWidget(widgetData);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas') {
      const widgetData = active.data.current as WidgetData;
      if (widgetData && !pageLayout.children.find(w => w.id === widgetData.id)) {
        // This is a new widget being added to canvas
        const newWidget: WidgetData = {
          ...widgetData,
          id: generateId()
        };
        
        setPageLayout(prev => ({
          ...prev,
          children: [...prev.children, newWidget]
        }));
      }
    }
    
    setActiveWidget(null);
  }, [pageLayout.children]);

  const handleWidgetSelect = useCallback((widget: WidgetData | null) => {
    setSelectedWidget(widget);
  }, []);

  const handleWidgetUpdate = useCallback((widgetId: string, updates: Partial<WidgetData>) => {
    setPageLayout(prev => ({
      ...prev,
      children: prev.children.map(widget => 
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    }));
  }, []);

  const handleWidgetDelete = useCallback((widgetId: string) => {
    setPageLayout(prev => ({
      ...prev,
      children: prev.children.filter(widget => widget.id !== widgetId)
    }));
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
    }
  }, [selectedWidget]);

  return (
    <div className="flex h-screen bg-gray-100">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Left Panel - Widget Library */}
        <WidgetPanel />
        
        {/* Center Canvas */}
        <Canvas 
          pageLayout={pageLayout}
          onWidgetSelect={handleWidgetSelect}
          onWidgetUpdate={handleWidgetUpdate}
          onWidgetDelete={handleWidgetDelete}
          selectedWidget={selectedWidget}
        />
        
        {/* Right Panel - Properties */}
        <PropertiesPanel 
          selectedWidget={selectedWidget}
          onWidgetUpdate={handleWidgetUpdate}
        />
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeWidget ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
              {activeWidget.type}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* JSON Toggle */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={() => setShowJson(!showJson)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </button>
      </div>
      
      {/* JSON Viewer */}
      {showJson && (
        <div className="fixed bottom-16 left-4 right-4 bg-white border rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm">{JSON.stringify(pageLayout, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 