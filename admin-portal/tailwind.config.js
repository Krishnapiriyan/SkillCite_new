/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#111827',
        accent:    '#2563EB',
        'accent-light': '#EFF6FF',
        surface:   '#FFFFFF',
        'bg-page': '#F8F9FC',
        muted:     '#6B7280',
        hint:      '#9CA3AF',
        border:    '#E5E7EB',
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        display:  ['"Bricolage Grotesque"', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
