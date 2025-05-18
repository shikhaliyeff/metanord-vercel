/**
 * MetaNord WordPress Theme Tailwind Config
 */

module.exports = {
  content: [
    './*.php',
    './inc/**/*.php',
    './template-parts/**/*.php',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066b3',
          dark: '#00508a',
          darker: '#003b66',
          light: '#4d94cd',
          lightest: '#e6f0f9',
        },
        accent: {
          DEFAULT: '#ff6b35',
          dark: '#e54b13',
        },
        neutral: {
          lightest: '#f7f9fc',
          light: '#e5e9f0',
          DEFAULT: '#c4c9d4',
          dark: '#6e7a94',
          darkest: '#2e3440',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      height: {
        'screen-75': '75vh',
        'screen-80': '80vh',
        'screen-85': '85vh',
        'screen-90': '90vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.dark'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.dark'),
              },
            },
            h1: {
              color: theme('colors.neutral.darkest'),
              fontFamily: theme('fontFamily.inter'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.neutral.darkest'),
              fontFamily: theme('fontFamily.inter'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.neutral.darkest'),
              fontFamily: theme('fontFamily.inter'),
              fontWeight: '700',
            },
            h4: {
              color: theme('colors.neutral.darkest'),
              fontFamily: theme('fontFamily.inter'),
              fontWeight: '700',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.primary.light'),
            },
            'ol > li::before': {
              color: theme('colors.primary.light'),
            },
            strong: {
              color: theme('colors.neutral.darkest'),
            },
          },
        },
      }),
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(46, 52, 64, 0.08)',
        'card-hover': '0 6px 30px -2px rgba(46, 52, 64, 0.12)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-up': 'fade-in-up 0.7s ease-out',
        'fade-in-down': 'fade-in-down 0.7s ease-out',
        'fade-in-left': 'fade-in-left 0.7s ease-out',
        'fade-in-right': 'fade-in-right 0.7s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};