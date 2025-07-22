import type { WidgetModule } from './BaseWidget';

const Carousel: WidgetModule = {
  getType() {
    return 'carousel';
  },

  render({ attributes, children }) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{attributes.title}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {children}
        </div>
      </div>
    );
  }
};

export default Carousel;

