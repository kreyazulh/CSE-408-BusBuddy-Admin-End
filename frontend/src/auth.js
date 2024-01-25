// auth.js
import { writable } from 'svelte/store';

// Read the initial value from localStorage
const initialIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
export const isAuthenticated = writable(initialIsAuthenticated);

export const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    isAuthenticated.set(data.isAuthenticated);
    return data.isAuthenticated; // Return the result for initialIsAuthenticated
  } catch (error) {
    console.error('Error checking session:', error);
    return false; // Default to false in case of errors
  }
};