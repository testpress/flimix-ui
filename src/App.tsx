import { useEffect, useState } from 'react';
import PageBuilder from './builder/PageBuilder';
import WidgetRenderer from './WidgetRenderer';
import { loadWidgets } from './loadWidgets';
import { endpoints } from './builder/api';

function App() {
  // State for widget system readiness
  const [widgetsReady, setWidgetsReady] = useState(false);
  // State for the current page data (structure and content)
  const [currentPageData, setCurrentPageData] = useState<any>(null);
  // State for initial loading spinner
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // State for preview refresh spinner
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  // State for preview mode toggle
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load widgets and fetch page data on mount
  useEffect(() => {
    loadWidgets().then(() => setWidgetsReady(true));
    fetchPageData(true);
  }, []);

  // Refresh data whenever preview mode is toggled on
  useEffect(() => {
    if (isPreviewMode) {
      fetchPageData(false);
    }
  }, [isPreviewMode]);

  // Fetch page data from API
  const fetchPageData = (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsInitialLoading(true);
    } else {
      setIsRefreshingPreview(true);
    }

    endpoints.getPageData()
      .then(pageData => {
        setCurrentPageData(pageData);
        setIsInitialLoading(false);
        setIsRefreshingPreview(false);
      })
      .catch(() => {
        setIsInitialLoading(false);
        setIsRefreshingPreview(false);
      });
  };

  if (!widgetsReady || isInitialLoading) {
    return <div className="text-white h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="bg-[#111] text-white w-full min-h-screen overflow-hidden">
      {/* Preview/Builder toggle button */}
      <div className="flex justify-end p-4">
        <button
          className={`px-4 py-2 rounded ${isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? 'Back to Builder' : 'Preview'}
        </button>
      </div>
      {/* Main content: Preview or Builder */}
      {isPreviewMode ? (
        <div className="preview-container">
          {isRefreshingPreview ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              Refreshing preview...
            </div>
          ) : (
            currentPageData?.children.map((widget: any, index: number) => (
              <WidgetRenderer key={index} widget={widget} />
            ))
          )}
        </div>
      ) : (
        <PageBuilder setIsPreviewMode={setIsPreviewMode} onPageUpdate={() => fetchPageData(false)} />
      )}
    </div>
  );
}

export default App;

