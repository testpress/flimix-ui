import type { WidgetModule } from './BaseWidget';
import WidgetRenderer from '../WidgetRenderer';

const Carousel: WidgetModule = {
  getType() {
    return 'carousel';
  },

  render({ attributes, children }) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "white", marginBottom: "10px" }}>{attributes.title}</h2>
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: "10px",
          paddingBottom: "10px"
        }}>
          {children}
        </div>
      </div>
    );
  }
};

export default Carousel;

