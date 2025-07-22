import type { WidgetModule } from './BaseWidget';

const HeroWidget: WidgetModule = {
  getType() {
    return 'hero';
  },

  render({ attributes }) {
    const { backgroundImage, title, description, cta } = attributes;
    return (
      <div 
        className="relative h-96 bg-cover bg-center flex flex-col justify-center px-10 text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl mb-6">{description}</p>
          <a 
            href={cta.link} 
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            {cta.text}
          </a>
        </div>
      </div>
    );
  }
};

export default HeroWidget;

