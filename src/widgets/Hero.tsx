import type { WidgetModule } from './BaseWidget';

const HeroWidget: WidgetModule = {
  getType() {
    return 'hero';
  },

  render({ attributes }) {
    const { backgroundImage, title, description, cta } = attributes;
    return (
      <div
        className="h-[80vh] w-full bg-cover bg-center text-white flex flex-col justify-center p-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        }}
      >
        <div className="max-w-[800px]">
          <h1 className="text-[3.5em] m-0 drop-shadow-lg">{title}</h1>
          <p className="text-[1.2em] max-w-[600px] drop-shadow">{description}</p>
          <a
            href={cta?.link || '#'}
            className="inline-block mt-5 px-6 py-3 bg-white text-black no-underline rounded font-bold uppercase tracking-wider"
          >
            {cta?.text || 'Watch Now'}
          </a>
        </div>
      </div>
    );
  }
};

export default HeroWidget;

