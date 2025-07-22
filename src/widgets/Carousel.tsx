import type { WidgetModule } from './BaseWidget';

const CarouselWidget: WidgetModule = {
  getType() {
    return 'carousel';
  },

  render({ attributes }) {
    const { title, items = [] } = attributes;

    return (
      <div className="px-10 py-5 w-full box-border">
        <h2 className="text-white mb-4 text-[1.8em] font-semibold">{title}</h2>
        <div className="flex overflow-x-auto gap-4 pb-5 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-[#111]">
          {items.map((item: any) => (
            <div key={item.id} className="flex-shrink-0 min-w-[200px] cursor-pointer">
              <img 
                src={item.image || 'https://placehold.co/200x300?text=No+Image'} 
                alt={item.title}
                className="w-full h-[300px] object-cover rounded-md"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x300?text=No+Image'; }}
              />
              <div className="mt-2">
                <h3 className="text-white text-sm font-medium">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.type}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-64 text-gray-500">
              No items to display
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default CarouselWidget;

// Add CSS to hide scrollbar but allow scrolling
const style = document.createElement('style');
style.textContent = `
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thumb-[#333] {
    scrollbar-color: #333 #111;
  }
`;
document.head.appendChild(style);

