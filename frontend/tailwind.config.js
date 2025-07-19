import { animate } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors:{
        darkblue:"rgb(17,24,39)",
        lightdark:"#121212",
        darkd:"#1e1e1e",
        skyblue:"rgb(0,180,216)",
        fadebrown:"rgb(220,220,211)",
        darkf:"RGB(52, 58, 64)",
        sky:"rgb(207,241,248)",
        mehendi:"rgb(245,245,245)",
        bluedark:"#37C0FE",
        orange:"rgb(249,115,22)",
        darkpurple:"rgb(31,41,55)",
        fadedark:"rgb(156,163,175)"
    
      },
      fontFamily: {
        Nunito: ["Nunito", 'serif'], // Add your font here
      },
     screens: {
        'xs': '395px', // 480px भन्दा ठूला screen को लागि
        '2xl': '1440px', // 1440px भन्दा ठूला screen को लागि
      },
      borderRadius: {
        'oval':'60% 40% 30% 70% / 60% 30% 70% 40%'   // अरू custom values
      },
      keyframes:{
        animate:{
          '0%':{
            borderRadius:"60% 40% 30% 70% / 60% 30% 70% 40%"
          },
          '50%':{
            borderRadius:"30% 60% 70% 40% / 50% 60% 30% 70%"
          },
          '100%':{
            borderRadius:"60% 40% 30% 70% / 60% 30% 70% 40%"
          }
        },
      },
      animation:{
        animate:'animate 5s ease-in-out infinite',
         'fade-in': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
    }
  },
  plugins: [],
}
}
