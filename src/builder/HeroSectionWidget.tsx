import { Plus } from 'lucide-react';

interface HeroSectionWidgetProps {
  section: any;
  sectionContent: any[];
  isSelected: boolean;
  onOpenContentManager: (e?: React.MouseEvent) => void;
  isContentLoading: boolean;
}

export default function HeroSectionWidget({
  section,
  sectionContent = [],
  onOpenContentManager,
  isContentLoading
}: HeroSectionWidgetProps) {
  const heroContent = sectionContent.length > 0 ? sectionContent[0].content : null;

  const handleOpenContentManager = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onOpenContentManager(e);
  };

  return (
    <div className="relative h-96 rounded-lg overflow-hidden group">
      {isContentLoading ? (
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">Loading...</div>
      ) : heroContent ? (
        <>
          <div className="absolute inset-0">
            <img
              src={heroContent.background_image_url || heroContent.poster_url || 'https://placehold.co/1920x1080?text=No+Image'}
              alt={heroContent.title}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center p-10">
            <div className="max-w-2xl">
              <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs uppercase tracking-wider rounded mb-3">
                {heroContent.type === 'movie' ? 'Movie' : 'Series'}
              </span>
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{heroContent.title}</h2>
              <p className="text-lg text-gray-200 mb-4 max-w-lg drop-shadow">
                {heroContent.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                {heroContent.release_year && (
                  <span>{heroContent.release_year}</span>
                )}
                {heroContent.duration_minutes && (
                  <span>{heroContent.duration_minutes} min</span>
                )}
                {heroContent.seasons && (
                  <span>{heroContent.seasons} seasons</span>
                )}
              </div>
              <button className="px-6 py-2 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors">
                Watch Now
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenContentManager}
            className="absolute top-4 right-4 px-3 py-1 bg-black bg-opacity-50 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Change Content
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{section.section.name}</h2>
            <p className="mb-4 text-gray-200">Add a movie or series to display here</p>
            <button
              type="button"
              onClick={handleOpenContentManager}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 