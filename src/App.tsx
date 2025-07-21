import { useEffect, useState } from 'react';
import { loadWidgets } from './loadWidgets';
import WidgetRenderer from './WidgetRenderer';

function App() {
  const [ready, setReady] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load widgets first
    loadWidgets().then(() => setReady(true));
    
    // Fetch page data from API
    fetch('http://localhost:8002/api/page-data/')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPageData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching page data:', error);
        setLoading(false);
      });
  }, []);

  if (!ready || loading) {
    return <div style={{ color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ 
      backgroundColor: '#111', 
      color: 'white',
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {pageData?.children.map((widget: any, index: number) => (
        <WidgetRenderer key={index} widget={widget} />
      ))}
    </div>
  );
}

export default App;

