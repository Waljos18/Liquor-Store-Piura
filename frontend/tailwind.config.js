/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#FF6F00',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        'text-main': '#212121',
        'text-secondary': '#757575',
      },
    },
  },
  plugins: [],
}
