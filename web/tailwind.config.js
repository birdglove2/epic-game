module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1800px',
        '4xl': '2200px',
        '5xl': '2600px',
      },
      spacing: {
        100: '32rem',
        110: '40rem',
        120: '48rem',
        '4/5': '80%',
        '3/4': '75%',
        '1/2': '50%',
        '2/3': '66%',
        '1/3': '33%',
        '1/4': '25%',
        '1/5': '20%',
        '1/6': '15%',
        '1/7': '12.5%',
        '1/10': '10%',
      },
      colors: {
        main1: '#0F52BA',
        main2: '#ec912b',
        main3: '#011359',
        sub1: '#deeefc',
        sub2: '#ffeedb',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(90deg)' },
          '99%': { transform: 'rotate(180deg)' },
          '100%': { display: 'none' },
        },
        jumpIn: {
          '100%': { display: 'block' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(10%)' },
        },
        hitBounce: {
          '0%': { transform: 'scale(1) translateY(0)' },
          '10%': { transform: 'scale(1.2, 0.6)' },
          '30%': { transform: 'scale(0.8, 1.1) translateY(-10px)' },
          '50%': { transform: 'scale(1) translateY(0)' },
          '100%': { transform: 'translateY(0)' },
        },
        shake: {
          '10%': { transform: 'translate3d(-1px, 0, 0' },
          '90%': { transform: 'translate3d(-1px, 0, 0' },

          '20%': { transform: 'translate3d(2px, 0, 0' },
          '80%': { transform: 'translate3d(2px, 0, 0' },

          '30%': { transform: 'translate3d(-4px, 0, 0' },
          '50%': { transform: 'translate3d(-4px, 0, 0' },
          '70%': { transform: 'translate3d(-4px, 0, 0' },

          '40%': { transform: 'translate3d(4px, 0, 0' },
          '60%': { transform: 'translate3d(4px, 0, 0' },
        },
        attack: {
          '0%': { transform: 'translateY(0%)' },
          '30%': { transform: 'translateY(-50%)' },
          '60%': { transform: 'translateY(-25%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        rotate: 'rotate 0.5s ease-in-out',
        jumpIn: 'jumpIn 0.5s ease-in-out',
        slideDown: 'slideDown 0.5s ease-in-out',
        hitBounce: 'hitBounce 1s ease',
        bounce: 'bounce 0.5s ease',
        // shake: 'shake 1.2s ease',
        attack: 'attack 1s ease',
      },
    },
  },
  plugins: [],
};
