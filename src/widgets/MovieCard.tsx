import type { WidgetModule } from './BaseWidget';

const MovieCard: WidgetModule = {
  getType() {
    return 'movie-card';
  },

  render({ attributes }) {
    const { poster, title, link } = attributes;
    return (
      <a href={link} style={{ textDecoration: "none", color: "white", minWidth: "160px" }}>
        <img
          src={poster}
          alt={title}
          style={{
            width: "160px",
            height: "240px",
            objectFit: "cover",
            borderRadius: "5px"
          }}
        />
        <p style={{ marginTop: "5px", fontSize: "0.9em" }}>{title}</p>
      </a>
    );
  }
};

export default MovieCard;

