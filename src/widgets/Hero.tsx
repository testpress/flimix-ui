import type { WidgetModule } from './BaseWidget';

const HeroWidget: WidgetModule = {
  getType() {
    return 'hero';
  },

  render({ attributes }) {
    const { backgroundImage, title, description, cta } = attributes;
    return (
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        height: "60vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px"
      }}>
        <h1 style={{ fontSize: "3em", margin: 0 }}>{title}</h1>
        <p style={{ fontSize: "1.2em", maxWidth: "600px" }}>{description}</p>
        <a href={cta.link} style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          textDecoration: "none"
        }}>{cta.text}</a>
      </div>
    );
  }
};

export default HeroWidget;

