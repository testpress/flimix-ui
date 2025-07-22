import type { WidgetModule } from './BaseWidget';

const Carousel: WidgetModule = {
  getType() {
    return 'carousel';
  },

  render({ attributes, children }) {
    return (
      <div className="px-10 py-5 w-full box-border">
        <h2 className="text-white mb-4 text-[1.8em] font-semibold">{attributes.title}</h2>
        <div className="flex overflow-x-auto gap-4 pb-5 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-[#111]">
          {children}
        </div>
      </div>
    );
  }
};

export default Carousel;

