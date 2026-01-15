import type { Config } from 'tailwindcss'

const config:  Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme:  {
    extend: {
      fontFamily: {
        sans: ['var(--font-urbanist)', 'sans-serif'],
      },
    },
  },
  plugins:  [
    function({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar':  {
            display: 'none'
          }
        }
      })
    }
  ],
}
export default config