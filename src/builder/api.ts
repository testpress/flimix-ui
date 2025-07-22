const API_URL = '/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const endpoints = {
  landingPages: async () => {
    const response = await fetch(`${API_URL}/landing-pages/`);
    const data = await handleResponse(response);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return [];
  },
  getLandingPage: async (id: number) => {
    const response = await fetch(`${API_URL}/landing-pages/${id}/`);
    return handleResponse(response);
  },
  createLandingPage: async (data: any) => {
    const response = await fetch(`${API_URL}/landing-pages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  updateLandingPage: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/landing-pages/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteLandingPage: async (id: number) => {
    const response = await fetch(`${API_URL}/landing-pages/${id}/`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  activateLandingPage: async (id: number) => {
    const response = await fetch(`${API_URL}/landing-pages/${id}/activate/`, {
      method: 'POST'
    });
    return handleResponse(response);
  },
  sections: async () => {
    const response = await fetch(`${API_URL}/sections/`);
    return handleResponse(response);
  },
  getSection: async (id: number) => {
    const response = await fetch(`${API_URL}/sections/${id}/`);
    return handleResponse(response);
  },
  createSection: async (data: any) => {
    const response = await fetch(`${API_URL}/sections/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  updateSection: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/sections/${id}/update/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  updateSectionName: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/sections/${id}/update/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteSection: async (id: number) => {
    const response = await fetch(`${API_URL}/sections/delete/${id}/`, {
      method: 'POST'
    });
    return handleResponse(response);
  },
  getSectionContent: async (sectionId: number) => {
    const response = await fetch(`${API_URL}/sections/${sectionId}/content/`);
    return handleResponse(response);
  },
  addContentToSection: async (sectionId: number, data: any) => {
    const response = await fetch(`${API_URL}/sections/${sectionId}/content/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  removeContentFromSection: async (sectionId: number, itemId: number) => {
    const response = await fetch(`${API_URL}/sections/${sectionId}/content/${itemId}/remove/`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  reorderSectionContent: async (sectionId: number, data: any) => {
    const response = await fetch(`${API_URL}/sections/${sectionId}/content/reorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  addSectionToLandingPage: async (landingPageId: number, sectionId: number) => {
    const response = await fetch(`${API_URL}/landing-pages/${landingPageId}/sections/${sectionId}/add/`, {
      method: 'POST'
    });
    return handleResponse(response);
  },
  removeSectionFromLandingPage: async (landingPageId: number, sectionId: number) => {
    const response = await fetch(`${API_URL}/landing-pages/${landingPageId}/sections/${sectionId}/remove/`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  reorderLandingPageSections: async (landingPageId: number, data: any) => {
    const response = await fetch(`${API_URL}/landing-pages/${landingPageId}/sections/reorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  movies: async () => {
    const response = await fetch(`${API_URL}/movies/`);
    return handleResponse(response);
  },
  series: async () => {
    const response = await fetch(`${API_URL}/series/`);
    return handleResponse(response);
  },
  genres: async () => {
    const response = await fetch(`${API_URL}/genres/`);
    return handleResponse(response);
  },
  getPageData: async (landingPageId?: number) => {
    const response = await fetch(`${API_URL}/page-data/${landingPageId ? `?landing_page_id=${landingPageId}` : ''}`);
    return handleResponse(response);
  }
}; 