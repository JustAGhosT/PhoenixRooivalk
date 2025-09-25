import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        secondary: '#0088ff',
        dark: '#0a0e1a',
        darker: '#050811',
        graytext: '#8892b0',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 255, 136, 0.3)',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(50px,50px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        gridMove: 'gridMove 20s linear infinite',
        fadeInUp: 'fadeInUp 1s ease both',
        float: 'float 3s ease-in-out infinite',
        radar: 'radar 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
