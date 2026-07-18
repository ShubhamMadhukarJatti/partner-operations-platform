import { Inter } from 'next/font/google'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

const {
  default: flattenColorPalette
} = require('tailwindcss/lib/util/flattenColorPalette')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '4rem'
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem'
      },
      screens: {
        xs: '100%',
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1536px'
      }
    },
    extend: {
      maxWidth: {
        /** 1440px — used across marketing; default Tailwind stops at 7xl (1280px) */
        '8xl': '90rem'
      },
      width: {
        '1/10': '10%'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['IBM Plex Serif', 'serif'],
        bethEllen: ['Beth Ellen"', 'cursive'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sen: ['Sen', 'sans-serif'],
        sansGeneral: ['"General Sans"', 'sans-serif'],
        geist: ['Geist', 'sans-serif']
      },
      fontWeight: {
        regular: '400',
        semibold: '600'
      },
      fontSize: {
        /* FDS groups: use text-heading + font-semibold, text-body + font-normal */
        heading: ['32px', { lineHeight: '40px', letterSpacing: '-0.0625rem' }],
        body: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'shark-2xs': [
          '0.625rem',
          {
            lineHeight: '0.875rem',
            letterSpacing: '0'
          }
        ],
        'shark-xs': [
          '0.75rem',
          {
            lineHeight: '1rem',
            letterSpacing: '0'
          }
        ],
        'shark-sm': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0'
          }
        ],
        'shark-base': [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0'
          }
        ],
        'shark-lg': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '-0.03125rem'
          }
        ],
        'shark-xl': [
          '1.5rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.03125rem'
          }
        ],
        'shark-2xl': [
          '2rem',
          {
            lineHeight: '2.5rem',
            letterSpacing: '-0.0625rem'
          }
        ],
        'shark-3xl': [
          '2.5rem',
          {
            lineHeight: '3rem',
            letterSpacing: '-0.0625rem'
          }
        ],
        'shark-4xl': [
          '3rem',
          {
            lineHeight: '3.5rem',
            letterSpacing: '-0.0625rem'
          }
        ],
        'shark-5xl': [
          '3.5rem',
          {
            lineHeight: '4rem',
            letterSpacing: '-0.0625rem'
          }
        ],
        'shark-hero': [
          '4.5rem',
          {
            lineHeight: '5rem',
            letterSpacing: '-0.0625rem'
          }
        ]
      },
      boxShadow: {
        xs: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
        sm: '0px 4.9px 19.6px 0px rgba(106, 115, 129, 0.12)',
        md: '0px 14.7px 29.41px 0px rgba(106, 115, 129, 0.16)',
        lg: '0px 29.41px 49.01px 0px rgba(106, 115, 129, 0.22)',
        top: '0px 9.8px 39.21px 0px rgba(0, 0, 0, 0.25)',
        left: '-2.45px 4.9px 19.6px 0px rgba(106, 115, 129, 0.22)',
        right: '2.45px 0px 19.6px 0px rgba(106, 115, 129, 0.22)',
        dashboardItem: '0px 4.9px 19.6px 0px #6A73811F;'
      },
      screens: {
        xs: '480px',
        xxl: '1560px',
        ...defaultTheme.screens
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          'light-blue': 'var(--light-blue)',
          'dark-blue': 'var(--dark-blue)',
          blue: 'var(--primary-blue)'
        },
        brandPrimary: {
          DEFAULT: 'hsl(var(--brand-primary))',
          hover: 'hsl(var(--brand-primary-hover))',
          light: 'hsl(var(--brand-primary-light))',
          'light-hover': 'hsl(var(--brand-primary-light-hover))'
        },
        brandDestructive: {
          DEFAULT: 'hsl(var(--brand-destructive))',
          hover: 'hsl(var(--brand-destructive-hover))',
          light: 'hsl(var(--brand-destructive-light))',
          'light-hover': 'hsl(var(--brand-destructive-light-hover))'
        },
        semantic: {
          success: 'var(--success)',
          info: 'var(--info)',
          caution: 'var(--caution)',
          danger: 'var(--danger)'
        },
        background: {
          DEFAULT: 'hsl(var(--background))',
          white: 'var(--background-white)',
          'ghost-white': 'var(--background-ghost-white)',
          'maastricht-blue': 'var(--background-maastricht-blue)',
          'banner-start': 'var(--background-banner-start)'
        },
        text: {
          '10': 'var(--text-10)',
          '20': 'var(--text-20)',
          '30': 'var(--text-30)',
          '40': 'var(--text-40)',
          '50': 'var(--text-50)',
          '60': 'var(--text-60)',
          '70': 'var(--text-70)',
          '80': 'var(--text-80)',
          '90': 'var(--text-90)',
          '100': 'var(--text-100)',
          black: 'var(--text-black)',
          muted: 'var(--text-muted)',
          'black-light': 'var(--text-black-light)',
          'heading-charcoal': 'var(--text-heading-charcoal)',
          secondary: 'var(--text-secondary)',
          'slate-900': 'var(--text-slate-900)',
          'card-muted': 'var(--text-card-muted)'
        },
        'icon-color-amber': 'var(--icon-color-amber)',
        'icon-color-green': 'var(--icon-color-green)',
        'icon-bg-amber': 'var(--icon-bg-amber)',
        'icon-bg-green': 'var(--icon-bg-green)',
        'shark-blue': {
          '50': 'var(--primary-shades-50)',
          '100': 'var(--primary-shades-100)',
          '200': 'var(--primary-shades-200)',
          '300': 'var(--primary-shades-300)',
          '400': 'var(--primary-shades-400)',
          '500': 'var(--primary-shades-500)',
          '600': 'var(--primary-shades-600)',
          '700': 'var(--primary-shades-700)',
          '800': 'var(--primary-shades-800)',
          '900': 'var(--primary-shades-900)',
          '950': 'var(--primary-shades-950)'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        success: {
          DEFAULT: colors.emerald[500],
          foreground: colors.emerald[200]
        },
        warning: {
          '50': 'var(--warning-50)',
          DEFAULT: colors.amber[500],
          foreground: colors.amber[200]
        },
        info: {
          DEFAULT: colors.sky[500],
          foreground: colors.sky[200]
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        inputField: {
          bg: 'hsl(var(--input-bg))',
          content: 'hsl(var(--input-content))',
          border: 'hsl(var(--input-border))',
          'bg-disabled': 'hsl(var(--input-bg-disabled))',
          'content-disabled': 'hsl(var(--input-content-disabled))',
          'border-disabled': 'hsl(var(--input-border-disabled))',
          'content-focus': 'hsl(var(--input-content-focus))',
          ring: 'hsl(var(--input-ring))',
          'bg-focus': 'hsl(var(--input-bg-focus))'
        }
      },
      backgroundImage: {
        'icon-blue-gradient':
          'linear-gradient(180deg, rgba(62, 80, 247, 0.10) 0%, rgba(36, 47, 145, 0.10) 100%)'
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(16rem, 1fr))',
        fluid: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))'
      },
      animation: {
        move: 'move 5s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fade-in 1000ms var(--animation-delay, 0ms) ease forwards',
        aurora: 'aurora 60s linear infinite',
        vibrate: 'vibrate 0.5s ease-in-out infinite',
        orbit: 'orbit calc(var(--duration)*1s) linear infinite',
        scalePulse: 'scaleAnim 1.5s ease-in-out infinite',
        scalePulseBlur: 'scaleAnimBlur 1.5s ease-in-out infinite',
        'collapsible-down': 'collapsible-down 0.3s ease-in-out',
        'collapsible-up': 'collapsible-up 0.3s ease-in-out',
        wave: 'wave 2.5s infinite',
        'hover-float': 'hover-float 1.2s ease-in-out infinite'
      },
      keyframes: {
        'hover-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        scaleAnim: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' }
        },
        scaleAnimBlur: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.2' }
        },
        vibrate: {
          '0%, 100%': {
            transform: 'translateX(0)'
          },
          '20%': {
            transform: 'translateX(-2px)'
          },
          '40%': {
            transform: 'translateX(2px)'
          },
          '60%': {
            transform: 'translateX(-2px)'
          },
          '80%': {
            transform: 'translateX(2px)'
          }
        },
        'collapsible-down': {
          from: {
            height: '0',
            opacity: '0'
          },
          to: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1'
          }
        },
        'collapsible-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1'
          },
          to: {
            height: '0',
            opacity: '0'
          }
        },
        move: {
          from: {
            transform: 'translateX(-200px)'
          },
          to: {
            transform: 'translateX(200px)'
          }
        },
        'accordion-down': {
          from: {
            height: 0
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: 0
          }
        },
        marquee: {
          from: {
            transform: 'translateX(0)'
          },
          to: {
            transform: 'translateX(calc(-50% - var(--gap)/2))'
          }
        },
        'fade-in': {
          from: {
            opacity: 0,
            transform: 'translateY(-10px)'
          },
          to: {
            opacity: 1,
            transform: 'none'
          }
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%'
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%'
          }
        },
        orbit: {
          '0%': {
            transform:
              'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))'
          },
          '100%': {
            transform:
              'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))'
          }
        }
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    addVariablesForColors
  ]
}

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ':root': newVars
  })
}
