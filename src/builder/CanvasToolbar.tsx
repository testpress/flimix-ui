import { Smartphone, Tablet, Monitor as Desktop } from 'lucide-react';

export default function CanvasToolbar({ viewport, setViewport }: any) {
  // Toolbar for switching between device viewports
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewport('desktop')}
          className={`p-2 rounded ${viewport === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        >
          <Desktop className="h-4 w-4 bg-black" />
        </button>
        <button
          onClick={() => setViewport('tablet')}
          className={`p-2 rounded ${viewport === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        >
          <Tablet className="h-4 w-4 bg-black" />
        </button>
        <button
          onClick={() => setViewport('mobile')}
          className={`p-2 rounded ${viewport === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        >
          <Smartphone className="h-4 w-4 bg-black" />
        </button>
      </div>
    </div>
  );
} 