export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getWidgetDefinitions() {
  return [
    {
      type: 'hero',
      name: 'Hero Section',
      icon: '🎬',
      defaultAttributes: {
        backgroundImage: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
        title: 'Movie Title',
        description: 'Movie description goes here',
        cta: { text: 'Watch Now', link: '#' }
      }
    },
    {
      type: 'carousel',
      name: 'Carousel',
      icon: '🎠',
      defaultAttributes: {
        title: 'Carousel Title'
      }
    },
    {
      type: 'movie-card',
      name: 'Movie Card',
      icon: '🎭',
      defaultAttributes: {
        title: 'Movie Title',
        poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
        link: '#'
      }
    }
  ];
} 