import React from 'react';
import { usePageBuilder } from '../contexts/PageBuilderContext';
import type { WidgetData } from '../types/PageBuilder';

const PropertyPanel: React.FC = () => {
  const { selectedWidget, pageData, updateWidget, removeWidget } = usePageBuilder();

  const findSelectedWidget = (): WidgetData | null => {
    if (!selectedWidget || !pageData) return null;
    
    const findWidget = (widgets: WidgetData[]): WidgetData | null => {
      for (const widget of widgets) {
        if (widget.id === selectedWidget) return widget;
        if (widget.children) {
          const found = findWidget(widget.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findWidget(pageData.children);
  };

  const widget = findSelectedWidget();

  if (!widget) {
    return (
      <div style={{
        width: '300px',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid #333',
        padding: '20px',
        height: '100vh',
        color: '#999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Select a widget to edit its properties
      </div>
    );
  }

  const handleAttributeChange = (key: string, value: any) => {
    updateWidget(widget.id, {
      attributes: { ...widget.attributes, [key]: value }
    });
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widget.id);
    }
  };

  const renderHeroProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Background Image URL
        </label>
        <input
          type="text"
          value={widget.attributes.backgroundImage || ''}
          onChange={(e) => handleAttributeChange('backgroundImage', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Title
        </label>
        <input
          type="text"
          value={widget.attributes.title || ''}
          onChange={(e) => handleAttributeChange('title', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Description
        </label>
        <textarea
          value={widget.attributes.description || ''}
          onChange={(e) => handleAttributeChange('description', e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white',
            resize: 'vertical'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          CTA Text
        </label>
        <input
          type="text"
          value={widget.attributes.cta?.text || ''}
          onChange={(e) => handleAttributeChange('cta', { 
            ...widget.attributes.cta, 
            text: e.target.value 
          })}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          CTA Link
        </label>
        <input
          type="text"
          value={widget.attributes.cta?.link || ''}
          onChange={(e) => handleAttributeChange('cta', { 
            ...widget.attributes.cta, 
            link: e.target.value 
          })}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
    </div>
  );

  const renderCarouselProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Carousel Title
        </label>
        <input
          type="text"
          value={widget.attributes.title || ''}
          onChange={(e) => handleAttributeChange('title', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
      
      <div style={{
        padding: '10px',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px',
        border: '1px solid #444'
      }}>
        <div style={{ color: 'white', fontSize: '12px', marginBottom: '5px' }}>
          Movies in carousel: {widget.children?.length || 0}
        </div>
        <div style={{ color: '#999', fontSize: '11px' }}>
          Drag movie cards here to add them
        </div>
      </div>
    </div>
  );

  const renderMovieCardProperties = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Movie Title
        </label>
        <input
          type="text"
          value={widget.attributes.title || ''}
          onChange={(e) => handleAttributeChange('title', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Poster URL
        </label>
        <input
          type="text"
          value={widget.attributes.poster || ''}
          onChange={(e) => handleAttributeChange('poster', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: 'white', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '5px' }}>
          Link URL
        </label>
        <input
          type="text"
          value={widget.attributes.link || ''}
          onChange={(e) => handleAttributeChange('link', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: 'white'
          }}
        />
      </div>
    </div>
  );

  const renderProperties = () => {
    switch (widget.type) {
      case 'hero':
        return renderHeroProperties();
      case 'carousel':
        return renderCarouselProperties();
      case 'movie-card':
        return renderMovieCardProperties();
      default:
        return <div style={{ color: '#999' }}>No properties available for this widget type.</div>;
    }
  };

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#1a1a1a',
      borderLeft: '1px solid #333',
      padding: '20px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #333'
      }}>
        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
          {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Properties
        </h3>
        <button
          onClick={handleRemove}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Remove
        </button>
      </div>
      
      {renderProperties()}
    </div>
  );
};

export default PropertyPanel; 