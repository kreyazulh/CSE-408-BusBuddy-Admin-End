/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: {
        700: '#f9faff',
        900: '#fff',
      },
      red: {
        50: '#ffe3e3',
        100: '#ffbdbd',
        200: '#ff9b9b',
        300: '#f86a6a',
        400: '#ef4e4e',
        500: '#e12d39',
        600: '#cf1124',
        700: '#ab091e',
        800: '#8a041a',
        900: '#610316',
      },
      gray: {
        50: '#f9fafb',
        100: '#f4f5f7',
        200: '#e5e7eb',
        300: '#d2d6dc',
        400: '#9fa6b2',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#252f3f',
        900: '#161e2e',
      },
      maroon: '#781b1b',
    },
    extend: {},
  },
  plugins: [],
}

