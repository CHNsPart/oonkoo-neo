const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const api = {
  syncUser: async () => {
    const response = await fetch(`${BASE_URL}/api/user/db-sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getUser: async () => {
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};