import React from 'react';
import { widgetTemplates } from '../data/WidgetTemplates';
import type { DragItem } from '../types/PageBuilder';

interface WidgetToolboxProps {
  onDragStart: (dragItem: DragItem) => void;
}

const WidgetToolbox: React.FC<WidgetToolboxProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, template: typeof widgetTemplates[0]) => {
    const dragItem: DragItem = {
      id: `template-${template.type}`,
      type: template.type,
      source: 'toolbox'
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragItem));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(dragItem);
  };

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#1a1a1a',
      borderRight: '1px solid #333',
      padding: '20px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <h3 style={{
        color: 'white',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Widgets
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {widgetTemplates.map((template) => (
          <div
            key={template.type}
            draggable
            onDragStart={(e) => handleDragStart(e, template)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              cursor: 'grab',
              border: '1px solid #333',
              transition: 'all 0.2s ease',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3a3a3a';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '24px' }}>{template.icon}</span>
            <div>
              <div style={{ fontWeight: '500', fontSize: '14px' }}>
                {template.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999',
                marginTop: '2px'
              }}>
                {template.type}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <h4 style={{
          color: 'white',
          marginBottom: '10px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Instructions
        </h4>
        <ul style={{
          color: '#ccc',
          fontSize: '12px',
          lineHeight: '1.4',
          margin: 0,
          paddingLeft: '15px'
        }}>
          <li>Drag widgets to the page</li>
          <li>Click widgets to edit</li>
          <li>Drag to reorder sections</li>
          <li>Add movies to carousels</li>
        </ul>
      </div>
    </div>
  );
};

export default WidgetToolbox; 