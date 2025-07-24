import type { WidgetModule } from './BaseWidget';

const SeriesCard: WidgetModule = {
  getType() {
    return 'series-card';
  },

  render({ attributes, children }) {
    const { poster, title, link, seasons } = attributes;
    return (
      <div className="relative">
        <a 
          href={link || '#'} 
          className="no-underline text-white min-w-[180px] relative block transition-transform duration-300 hover:scale-105 hover:z-10"
        >
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={poster || 'https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg'}
              alt={title || 'Series'}
              className="w-[180px] h-[270px] object-cover block"
            />
          </div>
          <p className="mt-2 text-[0.95em] font-medium text-center">{title || 'Series Title'}</p>
          {seasons && (
            <p className="text-[0.85em] text-[#aaa] text-center m-0">{seasons} Season{seasons > 1 ? 's' : ''}</p>
          )}
        </a>
        {children}
      </div>
    );
  }
};

export default SeriesCard; 