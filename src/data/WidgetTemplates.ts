import type { WidgetTemplate, WidgetData } from '../types/PageBuilder';

export const widgetTemplates: WidgetTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: '🎬',
    defaultAttributes: {
      backgroundImage: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
      title: 'New Movie Title',
      description: 'Enter movie description here...',
      cta: { text: 'Watch Now', link: '#' }
    }
  },
  {
    type: 'carousel',
    name: 'Movie Carousel',
    icon: '🎭',
    defaultAttributes: { 
      title: 'New Carousel' 
    },
    defaultChildren: [
      {
        id: `movie-${Date.now()}-1`,
        type: 'movie-card',
        attributes: {
          title: 'Sample Movie 1',
          poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
          link: '#'
        }
      },
      {
        id: `movie-${Date.now()}-2`,
        type: 'movie-card',
        attributes: {
          title: 'Sample Movie 2',
          poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
          link: '#'
        }
      }
    ]
  },
  {
    type: 'movie-card',
    name: 'Movie Card',
    icon: '🎞️',
    defaultAttributes: {
      title: 'New Movie',
      poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
      link: '#'
    }
  }
];

export const generateWidgetId = (type: string): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createWidgetFromTemplate = (template: WidgetTemplate): WidgetData => {
  return {
    id: generateWidgetId(template.type),
    type: template.type,
    attributes: { ...template.defaultAttributes },
    children: template.defaultChildren?.map(child => ({
      ...child,
      id: generateWidgetId(child.type)
    }))
  };
}; 