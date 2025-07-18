import React, { useState } from 'react';
import { usePageBuilder } from '../contexts/PageBuilderContext';
import EditableWidgetRenderer from './EditableWidgetRenderer';
import { createWidgetFromTemplate } from '../data/WidgetTemplates';
import type { DragItem } from '../types/PageBuilder';

const PageBuilderCanvas: React.FC = () => {
  const { pageData, addWidget, setSelectedWidget } = usePageBuilder();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const dragItem: DragItem = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (dragItem.source === 'toolbox') {
        const template = createWidgetFromTemplate({
          type: dragItem.type,
          name: '',
          icon: '',
          defaultAttributes: {}
        });
        addWidget(template);
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  const handleCanvasClick = () => {
    setSelectedWidget(null);
  };

  if (!pageData) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '18px'
        }}
        onClick={handleCanvasClick}
      >
        No page data loaded. Start by dragging widgets from the toolbox.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#111',
        overflowY: 'auto',
        position: 'relative',
        minHeight: '100vh'
      }}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone indicator */}
      {isDragOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          border: '3px dashed #007bff',
          borderRadius: '8px',
          padding: '40px',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{
            color: '#007bff',
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Drop widget here
          </div>
        </div>
      )}
      
      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {pageData.children.map((widget) => (
          <EditableWidgetRenderer key={widget.id} widget={widget} />
        ))}
      </div>
      
      {/* Empty state */}
      {pageData.children.length === 0 && !isDragOver && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#666',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎬</div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#999' }}>
            Start Building Your Page
          </h2>
          <p style={{ fontSize: '16px', color: '#666', maxWidth: '400px' }}>
            Drag widgets from the toolbox on the left to start creating your streaming platform page.
          </p>
        </div>
      )}
    </div>
  );
};

export default PageBuilderCanvas; 