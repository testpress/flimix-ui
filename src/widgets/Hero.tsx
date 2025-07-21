import type { WidgetModule } from './BaseWidget';

const HeroWidget: WidgetModule = {
  getType() {
    return 'hero';
  },

  render({ attributes }) {
    const { backgroundImage, title, description, cta } = attributes;
    return (
      <div style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        height: "80vh",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px"
      }}>
        <div style={{ maxWidth: "800px" }}>
          <h1 style={{ fontSize: "3.5em", margin: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>{title}</h1>
          <p style={{ fontSize: "1.2em", maxWidth: "600px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>{description}</p>
          <a href={cta?.link || '#'} style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "white",
            color: "black",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>{cta?.text || 'Watch Now'}</a>
        </div>
      </div>
    );
  }
};

export default HeroWidget;

