/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary:          'var(--color-primary)',
        'primary-hover':  'var(--color-primary-hover)',
        'primary-light':  'var(--color-primary-light)',
        secondary:        'var(--color-secondary)',
        success:          'var(--color-success)',
        'success-light':  'var(--color-success-light)',
        error:            'var(--color-error)',
        'error-light':    'var(--color-error-light)',
        warning:          'var(--color-warning)',
        'warning-light':  'var(--color-warning-light)',
        info:             'var(--color-info)',
        'info-light':     'var(--color-info-light)',
        background:       'var(--color-background)',
        surface:          'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border:           'var(--color-border)',
        'text-main':      'var(--color-text-main)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary':  'var(--color-text-tertiary)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs:  'var(--shadow-xs)',
        sm:  'var(--shadow-sm)',
        md:  'var(--shadow-md)',
        lg:  'var(--shadow-lg)',
        xl:  'var(--shadow-xl)',
      },
      transitionTimingFunction: {
        'ease-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
