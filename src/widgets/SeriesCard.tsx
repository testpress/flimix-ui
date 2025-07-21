import type { WidgetModule } from './BaseWidget';

const SeriesCard: WidgetModule = {
  getType() {
    return 'series-card';
  },

  render({ attributes, children }) {
    const { poster, title, link, seasons } = attributes;
    return (
      <div style={{ position: "relative" }}>
        <a 
          href={link || '#'} 
          style={{ 
            textDecoration: "none", 
            color: "white", 
            minWidth: "180px",
            transition: "transform 0.3s ease",
            position: "relative",
            display: "block"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.zIndex = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.zIndex = "0";
          }}
        >
          <div style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
          }}>
            <img
              src={poster || 'https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg'}
              alt={title || 'Series'}
              style={{
                width: "180px",
                height: "270px",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>
          <p style={{ 
            marginTop: "8px", 
            fontSize: "0.95em", 
            fontWeight: "500",
            textAlign: "center"
          }}>{title || 'Series Title'}</p>
          {seasons && (
            <p style={{
              fontSize: '0.85em',
              color: '#aaa',
              textAlign: 'center',
              margin: 0
            }}>{seasons} Season{seasons > 1 ? 's' : ''}</p>
          )}
        </a>
        {children}
      </div>
    );
  }
};

export default SeriesCard; 