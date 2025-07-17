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
            src={poster}
            alt={title}
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
        }}>{title}</p>
      </a>
    );
  }
};

export default MovieCard;

