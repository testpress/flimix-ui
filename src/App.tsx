import { useEffect, useState } from 'react';
import { loadWidgets } from './loadWidgets';
import PageBuilder from './builder/PageBuilder';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadWidgets().then(() => setReady(true));
  }, []);

  if (!ready) return <div className="flex items-center justify-center h-screen bg-gray-100">Loading widgets...</div>;

  return <PageBuilder />;
}

export default App;

