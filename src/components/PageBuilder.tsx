import React, { useEffect } from 'react';
import { usePageBuilder } from '../contexts/PageBuilderContext';
import PageBuilderHeader from './PageBuilderHeader';
import WidgetToolbox from './WidgetToolbox';
import PageBuilderCanvas from './PageBuilderCanvas';
import PropertyPanel from './PropertyPanel';
import WidgetRenderer from '../WidgetRenderer';
import type { DragItem, PageData } from '../types/PageBuilder';

interface PageBuilderProps {
  initialPageData?: PageData;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ initialPageData }) => {
  const { isEditMode, pageData, setPageData } = usePageBuilder();

  useEffect(() => {
    console.log('PageBuilder: initialPageData received:', initialPageData);
    console.log('PageBuilder: current isEditMode:', isEditMode);
    console.log('PageBuilder: current pageData:', pageData);
    
    if (initialPageData && !pageData) {
      console.log('PageBuilder: Setting initial page data');
      setPageData(initialPageData);
    }
  }, [initialPageData, pageData, setPageData, isEditMode]);

  const handleToolboxDragStart = (dragItem: DragItem) => {
    // This is handled by the toolbox component itself
  };

  console.log('PageBuilder: Rendering with isEditMode:', isEditMode, 'pageData:', pageData);

  // If not in edit mode, render the normal page view
  if (!isEditMode) {
    console.log('PageBuilder: Rendering preview mode');
    return (
      <div style={{ 
        backgroundColor: '#111', 
        color: 'white',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
        {pageData?.children.map((widget: any, index: number) => (
          <WidgetRenderer key={widget.id || index} widget={widget} />
        ))}
      </div>
    );
  }

  // Edit mode - show the full page builder interface
  console.log('PageBuilder: Rendering edit mode');
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#111'
    }}>
      <PageBuilderHeader />
      
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        <WidgetToolbox onDragStart={handleToolboxDragStart} />
        <PageBuilderCanvas />
        <PropertyPanel />
      </div>
    </div>
  );
};

export default PageBuilder; 