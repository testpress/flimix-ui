import type { WidgetModule } from './BaseWidget';

const MovieCard: WidgetModule = {
  getType() {
    return 'movie-card';
  },

  render({ attributes }) {
    const { poster, title, link } = attributes;
    return (
      <a 
        href={link} 
        className="no-underline text-white min-w-[180px] relative block transition-transform duration-300 hover:scale-105 hover:z-10"
      >
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={poster}
            alt={title}
            className="w-[180px] h-[270px] object-cover block"
          />
        </div>
        <p className="mt-2 text-[0.95em] font-medium text-center">{title}</p>
      </a>
    );
  }
};

export default MovieCard;

