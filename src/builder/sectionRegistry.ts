import { Image, Video } from 'lucide-react';
import HeroSectionWidget from './HeroSectionWidget';
import CarouselSectionWidget from './CarouselSectionWidget';

export const sectionRegistry = {
  hero: {
    id: 'hero',
    name: 'Hero Section',
    icon: Image,
    description: 'Full-width hero with background image',
    contentTypes: ['movie', 'series'],
    maxContent: 1,
    widget: HeroSectionWidget,
    defaultSettings: {}
  },
  carousel: {
    id: 'carousel',
    name: 'Movie Carousel',
    icon: Video,
    description: 'Horizontal scrolling carousel',
    contentTypes: ['movie', 'series'],
    maxContent: 20,
    widget: CarouselSectionWidget,
    defaultSettings: {}
  }
};

export const getSectionTypes = () => Object.values(sectionRegistry);
export const getSectionType = (id: string) => (sectionRegistry as any)[id] || null; 