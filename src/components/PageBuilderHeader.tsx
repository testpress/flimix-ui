import React from 'react';
import { usePageBuilder } from '../contexts/PageBuilderContext';

const PageBuilderHeader: React.FC = () => {
  const { isEditMode, setIsEditMode, pageData } = usePageBuilder();

  const handleSave = () => {
    if (pageData) {
      const dataStr = JSON.stringify(pageData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'page-config.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // You would typically validate the data structure here
            console.log('Loaded page data:', data);
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div style={{
      height: '60px',
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h1 style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          margin: 0
        }}>
          Flimix Page Builder
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px',
          backgroundColor: '#2a2a2a',
          borderRadius: '6px'
        }}>
          <button
            onClick={() => setIsEditMode(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: isEditMode ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
          >
            Edit Mode
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: !isEditMode ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
          >
            Preview Mode
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleLoad}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Load Page
        </button>
        
        <button
          onClick={handleSave}
          disabled={!pageData}
          style={{
            padding: '8px 16px',
            backgroundColor: pageData ? '#007bff' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pageData ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Save Page
        </button>
        
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#2a2a2a',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#999'
        }}>
          {pageData?.children?.length || 0} widgets
        </div>
      </div>
    </div>
  );
};

export default PageBuilderHeader; 