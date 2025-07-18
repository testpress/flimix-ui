import type { WidgetModule } from './BaseWidget';
import WidgetRenderer from '../WidgetRenderer';

const Carousel: WidgetModule = {
  getType() {
    return 'carousel';
  },

  render({ attributes, children }) {
    return (
      <div style={{ 
        padding: "20px 40px", 
        width: "100%",
        boxSizing: "border-box",
        position: "relative"
      }}>
        <h2 style={{ 
          color: "white", 
          marginBottom: "16px",
          fontSize: "1.8em",
          fontWeight: "600" 
        }}>{attributes.title || 'Carousel'}</h2>
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: "16px",
          paddingBottom: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: "#333 #111",
          minHeight: "300px"
        }}>
          {children}
        </div>
      </div>
    );
  }
};

export default Carousel;

