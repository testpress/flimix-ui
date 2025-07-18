import React, { useState } from 'react';
import { getWidgetByType } from '../loadWidgets';
import { usePageBuilder } from '../contexts/PageBuilderContext';
import { createWidgetFromTemplate } from '../data/WidgetTemplates';
import type { WidgetData, DragItem, DropResult } from '../types/PageBuilder';

interface EditableWidgetRendererProps {
  widget: WidgetData;
  depth?: number;
}

const EditableWidgetRenderer: React.FC<EditableWidgetRendererProps> = ({ widget, depth = 0 }) => {
  const { selectedWidget, setSelectedWidget, addWidget, moveWidget } = usePageBuilder();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const Widget = getWidgetByType(widget.type);
  if (!Widget) return null;

  const isSelected = selectedWidget === widget.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWidget(widget.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    const dragItem: DragItem = {
      id: widget.id,
      type: widget.type,
      source: 'page',
      widgetData: widget
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragItem));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (y < height * 0.2) {
      setDragPosition('before');
    } else if (y > height * 0.8) {
      setDragPosition('after');
    } else {
      setDragPosition('inside');
    }
    
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only clear if we're leaving the element entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragPosition(null);
    
    try {
      const dragItem: DragItem = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (dragItem.source === 'toolbox') {
        // Creating new widget from toolbox
        const template = createWidgetFromTemplate({
          type: dragItem.type,
          name: '',
          icon: '',
          defaultAttributes: {}
        });
        addWidget(template, widget.id);
      } else if (dragItem.source === 'page' && dragItem.id !== widget.id) {
        // Moving existing widget
        if (dragPosition) {
          moveWidget(dragItem.id, widget.id, dragPosition);
        }
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  const getDropIndicatorStyle = () => {
    if (!isDragOver || !dragPosition) return {};
    
    const baseStyle = {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      height: '4px',
      backgroundColor: '#007bff',
      zIndex: 1000,
      pointerEvents: 'none' as const
    };
    
    switch (dragPosition) {
      case 'before':
        return { ...baseStyle, top: 0 };
      case 'after':
        return { ...baseStyle, bottom: 0 };
      case 'inside':
        return {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          border: '2px dashed #007bff',
          zIndex: 1000,
          pointerEvents: 'none' as const
        };
      default:
        return {};
    }
  };

  const children = widget.children?.map((child: WidgetData, i: number) => (
    <EditableWidgetRenderer key={child.id} widget={child} depth={depth + 1} />
  ));

  const widgetElement = Widget.render({ attributes: widget.attributes, children });

  return (
    <div
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #007bff' : 'none',
        outlineOffset: '2px'
      }}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator */}
      {isDragOver && <div style={getDropIndicatorStyle()} />}
      
      {/* Selection overlay */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 1001,
          display: 'flex',
          gap: '4px'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {widget.type}
          </div>
        </div>
      )}
      
      {/* Widget content */}
      {React.cloneElement(widgetElement, {
        style: {
          ...widgetElement.props.style,
          position: 'relative'
        }
      })}
    </div>
  );
};

export default EditableWidgetRenderer; 