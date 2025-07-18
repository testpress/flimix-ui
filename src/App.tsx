import { useEffect, useState } from 'react';
import { loadWidgets } from './loadWidgets';
import { PageBuilderProvider } from './contexts/PageBuilderContext';
import PageBuilder from './components/PageBuilder';
import { generateWidgetId } from './data/WidgetTemplates';
import type { PageData } from './types/PageBuilder';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load widgets first
    loadWidgets().then(() => setReady(true));
  }, []);

  if (!ready) {
    return <div style={{ color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // Initialize with the existing page data structure
  const initialPageData: PageData = {
    type: 'page',
    children: [
      {
        id: generateWidgetId('hero'),
        type: 'hero',
        attributes: {
          backgroundImage: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
          title: 'Dune: Part Two',
          description: 'Paul Atreides unites with the Fremen to wage war against House Harkonnen.',
          cta: { text: 'Watch Now', link: '#' }
        }
      },
      {
        id: generateWidgetId('carousel'),
        type: 'carousel',
        attributes: { title: 'Trending Now' },
        children: [
          {
            id: generateWidgetId('movie-card'),
            type: 'movie-card',
            attributes: {
              title: 'Oppenheimer',
              poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
              link: '#'
            }
          },
          {
            id: generateWidgetId('movie-card'),
            type: 'movie-card',
            attributes: {
              title: 'The Batman',
              poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
              link: '#'
            }
          }
        ]
      },
      {
        id: generateWidgetId('carousel'),
        type: 'carousel',
        attributes: { title: 'Action & Adventure' },
        children: [
          {
            id: generateWidgetId('movie-card'),
            type: 'movie-card',
            attributes: {
              title: 'John Wick 4',
              poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
              link: '#'
            }
          },
          {
            id: generateWidgetId('movie-card'),
            type: 'movie-card',
            attributes: {
              title: 'Extraction 2',
              poster: 'https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg',
              link: '#'
            }
          }
        ]
      }
    ]
  };

  return (
    <PageBuilderProvider>
      <PageBuilder initialPageData={initialPageData} />
    </PageBuilderProvider>
  );
}

export default App;

