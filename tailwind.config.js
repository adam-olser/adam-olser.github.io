/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-switching tokens — values live in CSS vars (see index.css)
        // RGB channel format enables Tailwind opacity modifiers (bg-primary/10 etc.)
        'primary':                    'rgb(var(--color-primary) / <alpha-value>)',
        'surface':                    'rgb(var(--color-surface) / <alpha-value>)',
        'surface-dim':                'rgb(var(--color-surface-dim) / <alpha-value>)',
        'surface-bright':             'rgb(var(--color-surface-bright) / <alpha-value>)',
        'surface-container-lowest':   'rgb(var(--color-surface-container-lowest) / <alpha-value>)',
        'surface-container-low':      'rgb(var(--color-surface-container-low) / <alpha-value>)',
        'surface-container':          'rgb(var(--color-surface-container) / <alpha-value>)',
        'surface-container-high':     'rgb(var(--color-surface-container-high) / <alpha-value>)',
        'surface-container-highest':  'rgb(var(--color-surface-container-highest) / <alpha-value>)',
        'surface-variant':            'rgb(var(--color-surface-variant) / <alpha-value>)',
        'on-surface':                 'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant':         'rgb(var(--color-on-surface-variant) / <alpha-value>)',
        'background':                 'rgb(var(--color-background) / <alpha-value>)',
        'on-background':              'rgb(var(--color-on-background) / <alpha-value>)',
        // Theme-switching
        'primary-container':          'rgb(var(--color-primary-container) / <alpha-value>)',
        'on-primary':                 'rgb(var(--color-on-primary) / <alpha-value>)',
        'on-primary-container':       '#f9e8ff',
        'primary-fixed':              '#f3daff',
        'primary-fixed-dim':          '#e3b5ff',
        'outline':                    '#9a8ca0',
        'outline-variant':            '#4e4355',
        'surface-tint':               '#e3b5ff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        amethyst: '8px',
      },
      boxShadow: {
        'glow': '0px 12px 32px rgba(160, 32, 240, 0.15)',
        'glow-lg': '0 24px 48px -12px rgba(160, 32, 240, 0.25)',
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.04em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
}
