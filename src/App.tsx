import { useEffect, useState } from 'react';
import { loadWidgets } from './loadWidgets';
import WidgetRenderer from './WidgetRenderer';

const pageJson = {
  type: 'page',
  children: [
    {
      type: 'hero',
      attributes: {
        backgroundImage: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with the Fremen to wage war against House Harkonnen.',
        cta: { text: 'Watch Now', link: '#' }
      }
    },
    {
      type: 'carousel',
      attributes: { title: 'Trending Now' },
      children: [
        {
          type: 'movie-card',
          attributes: {
            title: 'Oppenheimer',
            poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
            link: '#'
          }
        },
        {
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
      type: 'carousel',
      attributes: { title: 'Action & Adventure' },
      children: [
        {
          type: 'movie-card',
          attributes: {
            title: 'John Wick 4',
            poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
            link: '#'
          }
        },
        {
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

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadWidgets().then(() => setReady(true));
  }, []);

  if (!ready) return <div style={{ color: 'white' }}>Loading widgets...</div>;

  return (
    <div style={{ backgroundColor: '#111', color: 'white' }}>
      {pageJson.children.map((widget, index) => (
        <WidgetRenderer key={index} widget={widget} />
      ))}
    </div>
  );
}

export default App;

