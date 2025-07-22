import moviesData from './data/movies.json';
import seriesData from './data/series.json';
import sectionsData from './data/sections.json';
import landingPagesData from './data/landingPages.json';

// Type definitions for content, section, landing page, etc.
interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  poster_url: string;
  background_image_url?: string;
}

interface Section {
  id: number;
  name: string;
  section_type: string;
  content_selection_type: string;
}

interface LandingPageSection {
  id: number;
  section: Section;
}

interface LandingPage {
  id: number;
  name: string;
  is_active: boolean;
  landingpagesection_set: LandingPageSection[];
}

interface SectionContent {
  id: number;
  content_type: string;
  content_id: number;
  content: Content;
}

// In-memory stores initialized from imported JSON data
let mockMovies: Content[] = moviesData as Content[];
let mockSeries: Content[] = seriesData as Content[];
let mockSections: Section[] = sectionsData as Section[];
let mockLandingPages: LandingPage[] = landingPagesData as LandingPage[];

let nextSectionId = mockSections.length + 1;
let nextSectionContentId = 5; // Start after our pre-populated content

// Section content store, keyed by section id
let mockSectionContent: Record<number, SectionContent[]> = {
  1: [
    {
      id: 1,
      content_type: 'movie',
      content_id: 1,
      content: mockMovies[0]
    }
  ],
  2: [
    {
      id: 2,
      content_type: 'movie',
      content_id: 2,
      content: mockMovies[1]
    },
    {
      id: 3,
      content_type: 'movie',
      content_id: 3,
      content: mockMovies[2]
    },
    {
      id: 4,
      content_type: 'movie',
      content_id: 4,
      content: mockMovies[3]
    }
  ]
};

// Helper to find content by type and id
const findContentById = (type: string, id: number): Content | null => {
  if (type === 'movie') {
    return mockMovies.find(movie => movie.id === id) || null;
  } else if (type === 'series') {
    return mockSeries.find(series => series.id === id) || null;
  }
  return null;
};

// Simulate async API response
const asyncResponse = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};

export const endpoints = {
  // Landing page endpoints
  landingPages: async () => asyncResponse(mockLandingPages),

  getLandingPage: async (id: number) => {
    const landingPage = mockLandingPages.find(lp => lp.id === id);
    if (!landingPage) throw new Error('Landing page not found');
    return asyncResponse(landingPage);
  },

  // Section endpoints
  sections: async () => asyncResponse(mockSections),

  getSection: async (id: number) => {
    const section = mockSections.find(s => s.id === id);
    if (!section) throw new Error('Section not found');
    return asyncResponse(section);
  },
  createSection: async (data: { name: string; section_type: string; content_selection_type: string }) => {
    const newSection: Section = {
      id: nextSectionId++,
      name: data.name,
      section_type: data.section_type,
      content_selection_type: data.content_selection_type
    };
    mockSections.push(newSection);
    mockSectionContent[newSection.id] = [];
    return asyncResponse(newSection);
  },

  updateSection: async (id: number, data: Partial<Section>) => {
    const index = mockSections.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Section not found');
    mockSections[index] = { ...mockSections[index], ...data };
    mockLandingPages = mockLandingPages.map(lp => ({
      ...lp,
      landingpagesection_set: lp.landingpagesection_set.map(lpSection => {
        if (lpSection.section.id === id) {
          return {
            ...lpSection,
            section: { ...lpSection.section, ...data }
          };
        }
        return lpSection;
      })
    }));
    return asyncResponse(mockSections[index]);
  },

  updateSectionName: async (id: number, data: { name: string }) => endpoints.updateSection(id, data),
  
  deleteSection: async (id: number) => {
    const initialLength = mockSections.length;
    mockSections = mockSections.filter(s => s.id !== id);
    delete mockSectionContent[id];
    mockLandingPages = mockLandingPages.map(lp => ({
      ...lp,
      landingpagesection_set: lp.landingpagesection_set.filter(lpSection => lpSection.section.id !== id)
    }));
    if (mockSections.length === initialLength) throw new Error('Section not found');
    return asyncResponse({ success: true });
  },
  
  getSectionContent: async (sectionId: number) => asyncResponse(mockSectionContent[sectionId] || []),
  
  addContentToSection: async (sectionId: number, data: { content_type: string; content_id: number }) => {
    const content = findContentById(data.content_type, data.content_id);
    if (!content) throw new Error('Content not found');
    if (!mockSectionContent[sectionId]) {
      mockSectionContent[sectionId] = [];
    }
    const newContent: SectionContent = {
      id: nextSectionContentId++,
      content_type: data.content_type,
      content_id: data.content_id,
      content: content
    };
    mockSectionContent[sectionId].push(newContent);
    return asyncResponse(newContent);
  },
  
  removeContentFromSection: async (sectionId: number, itemId: number) => {
    if (!mockSectionContent[sectionId]) {
      return asyncResponse({ success: true });
    }
    const initialLength = mockSectionContent[sectionId].length;
    mockSectionContent[sectionId] = mockSectionContent[sectionId].filter(item => item.id !== itemId);
    if (mockSectionContent[sectionId].length === initialLength) {
      throw new Error('Content item not found');
    }
    return asyncResponse({ success: true });
  },
  
  reorderSectionContent: async (sectionId: number, data: { content_order: string }) => {
    if (!mockSectionContent[sectionId]) return asyncResponse({ success: true });
    const orderArray = data.content_order.split(',').map(id => parseInt(id));
    const reorderedContent: SectionContent[] = [];
    orderArray.forEach(id => {
      const item = mockSectionContent[sectionId].find(content => content.id === id);
      if (item) reorderedContent.push(item);
    });
    mockSectionContent[sectionId] = reorderedContent;
    return asyncResponse({ success: true });
  },
  
  addSectionToLandingPage: async (landingPageId: number, sectionId: number) => {
    const landingPageIndex = mockLandingPages.findIndex(lp => lp.id === landingPageId);
    const section = mockSections.find(s => s.id === sectionId);
    if (landingPageIndex === -1 || !section) throw new Error('Landing page or section not found');
    const newLandingPageSection: LandingPageSection = {
      id: Math.floor(Math.random() * 10000),
      section: { ...section }
    };
    mockLandingPages[landingPageIndex].landingpagesection_set.push(newLandingPageSection);
    return asyncResponse(newLandingPageSection);
  },
  
  removeSectionFromLandingPage: async (landingPageId: number, sectionId: number) => {
    const landingPageIndex = mockLandingPages.findIndex(lp => lp.id === landingPageId);
    if (landingPageIndex === -1) throw new Error('Landing page not found');
    const initialLength = mockLandingPages[landingPageIndex].landingpagesection_set.length;
    mockLandingPages[landingPageIndex].landingpagesection_set = 
      mockLandingPages[landingPageIndex].landingpagesection_set.filter(
        lpSection => lpSection.section.id !== sectionId
      );
    if (mockLandingPages[landingPageIndex].landingpagesection_set.length === initialLength) {
      throw new Error('Section not found in landing page');
    }
    return asyncResponse({ success: true });
  },
  
  reorderLandingPageSections: async (landingPageId: number, data: { section_order: string }) => {
    const landingPageIndex = mockLandingPages.findIndex(lp => lp.id === landingPageId);
    if (landingPageIndex === -1) throw new Error('Landing page not found');
    const orderArray = data.section_order.split(',').map(id => parseInt(id));
    const reorderedSections: LandingPageSection[] = [];
    orderArray.forEach(id => {
      const section = mockLandingPages[landingPageIndex].landingpagesection_set.find(
        lpSection => lpSection.id === id
      );
      if (section) reorderedSections.push(section);
    });
    mockLandingPages[landingPageIndex].landingpagesection_set = reorderedSections;
    return asyncResponse({ success: true });
  },

  // Content endpoints
  movies: async () => asyncResponse(mockMovies),
  series: async () => asyncResponse(mockSeries),
  getPageData: async (landingPageId?: number) => {
    let targetPage;
    if (landingPageId) {
      targetPage = mockLandingPages.find(lp => lp.id === landingPageId);
    } else {
      targetPage = mockLandingPages.find(lp => lp.is_active);
    }
    if (!targetPage) {
      targetPage = mockLandingPages[0];
    }
    const pageData = {
      id: targetPage.id,
      name: targetPage.name,
      children: targetPage.landingpagesection_set.map(lpSection => {
        const sectionType = lpSection.section.section_type;
        const sectionContent = mockSectionContent[lpSection.section.id] || [];
        if (sectionType === 'hero' && sectionContent.length > 0) {
          const content = sectionContent[0].content;
          return {
            type: 'hero',
            attributes: {
              title: content.title,
              description: content.description,
              backgroundImage: content.background_image_url || content.poster_url,
              cta: { text: 'Watch Now', link: '#' }
            }
          };
        } else if (sectionType === 'carousel') {
          return {
            type: 'carousel',
            attributes: {
              title: lpSection.section.name,
              items: sectionContent.map(item => ({
                id: item.content.id,
                title: item.content.title,
                image: item.content.poster_url,
                type: item.content.type
              }))
            }
          };
        } else if (sectionType === 'hero' && sectionContent.length === 0) {
          return {
            type: 'hero',
            attributes: {
              title: lpSection.section.name,
              description: 'No content added yet',
              backgroundImage: 'https://placehold.co/1920x1080?text=No+Content',
              cta: { text: 'Add Content', link: '#' }
            }
          };
        } else if (sectionType === 'carousel' && sectionContent.length === 0) {
          return {
            type: 'carousel',
            attributes: {
              title: lpSection.section.name,
              items: []
            }
          };
        }
        return {
          type: sectionType,
          attributes: {
            title: lpSection.section.name
          }
        };
      })
    };
    return asyncResponse(pageData);
  }
}; 