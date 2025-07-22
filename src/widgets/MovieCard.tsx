import type { WidgetModule } from './BaseWidget';

const MovieCard: WidgetModule = {
  getType() {
    return 'movie-card';
  },

  render({ attributes }) {
    const { poster, title, link } = attributes;
    return (
      <a href={link} className="block text-white no-underline min-w-40 hover:scale-105 transition-transform">
        <img
          src={poster}
          alt={title}
          className="w-40 h-60 object-cover rounded-lg shadow-lg"
        />
        <p className="mt-2 text-sm font-medium truncate">{title}</p>
      </a>
    );
  }
};

export default MovieCard;

