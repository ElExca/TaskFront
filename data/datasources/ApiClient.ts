const API_BASE_URL = 'http://localhost:3000/api/tasks'; // Cambia esto si tu API no está en localhost

export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  },
  post: async (url: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  },
};
