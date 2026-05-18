module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary colors from globals.css
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ff0000', // mainColor3 from globals.css
        },
        secondary: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          DEFAULT: '#33ff00', // confirmado from globals.css
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#ff5e00', // solicitado from globals.css
        },
        
        // Background colors
        background: {
          DEFAULT: '#1f1f1f', // --background from globals.css
          dark: '#000000',    // --mainColor1 from globals.css
          light: '#ffffff',   // --mainColor2 from globals.css
        },
        
        // Text colors
        text: {
          primary: '#ffffff',   // --mainColor2 from globals.css
          secondary: '#000000', // --mainColor1 from globals.css
          accent: '#ff0000',    // --mainColor3 from globals.css
        },
        
        // Semantic colors
        header: '#000000',      // --header from globals.css
        span: '#ff0000',        // --span from globals.css
        confirmado: '#33ff00',  // --confirmado from globals.css
        solicitado: '#ff5e00',  // --solicitado from globals.css
      },
      
      fontFamily: {
        anton: ['var(--font-anton)', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        sans: ['var(--font-oswald)', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        base: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
        '3xl': '3.5rem',
        '4xl': '4rem',
      },
      
      boxShadow: {
        'main-ease': '0 5px 20px rgba(0, 0, 0, 0.534)', // --mainShadowEase
        'main': '0 5px 20px rgba(0, 0, 0, 0.836)',     // --mainShadow
        'button': '0 5px 10px rgba(255, 0, 0, 0.459)',  // --buttonShadow
      },
      
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
