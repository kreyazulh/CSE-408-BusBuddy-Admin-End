// auth.js
import { writable } from 'svelte/store';

// Read the initial value from localStorage
const initialIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = writable(initialIsAuthenticated);

export const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-session',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    const data = await response.json();

    isAuthenticated.set(data.isAuthenticated);
  } catch (error) {
    console.error('Error checking session:', error);
  }
};
