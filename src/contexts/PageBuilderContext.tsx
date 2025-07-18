import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PageBuilderContextType, PageData, WidgetData } from '../types/PageBuilder';

const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

export const usePageBuilder = () => {
  const context = useContext(PageBuilderContext);
  if (!context) {
    throw new Error('usePageBuilder must be used within a PageBuilderProvider');
  }
  return context;
};

interface PageBuilderProviderProps {
  children: React.ReactNode;
}

export const PageBuilderProvider: React.FC<PageBuilderProviderProps> = ({ children }) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);

  const findWidgetById = useCallback((widgets: WidgetData[], id: string): WidgetData | null => {
    for (const widget of widgets) {
      if (widget.id === id) return widget;
      if (widget.children) {
        const found = findWidgetById(widget.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateWidgetInTree = useCallback((widgets: WidgetData[], id: string, updates: Partial<WidgetData>): WidgetData[] => {
    return widgets.map(widget => {
      if (widget.id === id) {
        return { ...widget, ...updates };
      }
      if (widget.children) {
        return { ...widget, children: updateWidgetInTree(widget.children, id, updates) };
      }
      return widget;
    });
  }, []);

  const removeWidgetFromTree = useCallback((widgets: WidgetData[], id: string): WidgetData[] => {
    return widgets.filter(widget => {
      if (widget.id === id) return false;
      if (widget.children) {
        widget.children = removeWidgetFromTree(widget.children, id);
      }
      return true;
    });
  }, []);

  const addWidgetToTree = useCallback((widgets: WidgetData[], newWidget: WidgetData, parentId?: string): WidgetData[] => {
    if (!parentId) {
      return [...widgets, newWidget];
    }
    
    return widgets.map(widget => {
      if (widget.id === parentId) {
        return { ...widget, children: [...(widget.children || []), newWidget] };
      }
      if (widget.children) {
        return { ...widget, children: addWidgetToTree(widget.children, newWidget, parentId) };
      }
      return widget;
    });
  }, []);

  const addWidget = useCallback((widget: WidgetData, parentId?: string) => {
    if (!pageData) return;
    
    const newPageData = {
      ...pageData,
      children: addWidgetToTree(pageData.children, widget, parentId)
    };
    setPageData(newPageData);
  }, [pageData, addWidgetToTree]);

  const removeWidget = useCallback((id: string) => {
    if (!pageData) return;
    
    const newPageData = {
      ...pageData,
      children: removeWidgetFromTree(pageData.children, id)
    };
    setPageData(newPageData);
    if (selectedWidget === id) {
      setSelectedWidget(null);
    }
  }, [pageData, removeWidgetFromTree, selectedWidget]);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetData>) => {
    if (!pageData) return;
    
    const newPageData = {
      ...pageData,
      children: updateWidgetInTree(pageData.children, id, updates)
    };
    setPageData(newPageData);
  }, [pageData, updateWidgetInTree]);

  const moveWidget = useCallback((fromId: string, toId: string, position: 'before' | 'after' | 'inside') => {
    if (!pageData) return;
    
    // Find the widget to move
    const widgetToMove = findWidgetById(pageData.children, fromId);
    if (!widgetToMove) return;
    
    // Remove the widget from its current position
    const pageWithoutWidget = {
      ...pageData,
      children: removeWidgetFromTree(pageData.children, fromId)
    };
    
    // Add the widget to its new position
    let newChildren = [...pageWithoutWidget.children];
    
    if (position === 'inside') {
      newChildren = addWidgetToTree(newChildren, widgetToMove, toId);
    } else {
      // Find the target widget and insert before/after
      const insertIndex = newChildren.findIndex(w => w.id === toId);
      if (insertIndex !== -1) {
        const insertAt = position === 'after' ? insertIndex + 1 : insertIndex;
        newChildren.splice(insertAt, 0, widgetToMove);
      }
    }
    
    setPageData({ ...pageWithoutWidget, children: newChildren });
  }, [pageData, findWidgetById, removeWidgetFromTree, addWidgetToTree]);

  const value: PageBuilderContextType = {
    pageData,
    setPageData,
    selectedWidget,
    setSelectedWidget,
    isEditMode,
    setIsEditMode,
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget
  };

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  );
}; 