import { useEffect, useState } from 'react';
import PageBuilder from './builder/PageBuilder';
import WidgetRenderer from './WidgetRenderer';
import { loadWidgets } from './loadWidgets';

function App() {
  const [ready, setReady] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load widgets and fetch page data
  useEffect(() => {
    loadWidgets().then(() => setReady(true));
    fetch('http://localhost:8002/api/page-data/')
      .then(response => response.json())
      .then(data => {
        setPageData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (!ready || loading) {
    return <div className="text-white h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="bg-[#111] text-white w-full min-h-screen overflow-hidden">
      <div className="flex justify-end p-4">
        <button
          className={`px-4 py-2 rounded ${isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? 'Back to Builder' : 'Preview'}
        </button>
      </div>
      {isPreviewMode ? (
        <div>
          {pageData?.children.map((widget: any, index: number) => (
            <WidgetRenderer key={index} widget={widget} />
          ))}
        </div>
      ) : (
        <PageBuilder setIsPreviewMode={setIsPreviewMode} />
      )}
    </div>
  );
}

export default App;

