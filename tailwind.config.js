/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1DB954",
          black: "#121212",
          dark: "#181818",
          light: "#282828",
          gray: "#B3B3B3",
          white: "#FFFFFF",
        },
        accent: {
          neon: "#14F195",
          cyber: "#00E1FF",
        }
      },

      spacing: {
        "4.5": "1.15rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "25": "6.25rem",
        "30": "7.5rem",
        "50": "12.5rem",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "Arial"],
        display: ["Poppins", "Inter", "system-ui"],
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.45)",
        insetGlow: "inset 0 0 16px rgba(29,185,84,0.2)",
        soft: "0px 8px 25px rgba(0,0,0,0.2)",
      },

      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
        round: "2rem",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0px #1DB954" },
          "100%": { boxShadow: "0 0 20px #1DB954" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.45s ease-in-out",
        slideRight: "slideRight 0.45s ease-in-out",
        pulseSoft: "pulseSoft 1.8s infinite ease-in-out",
        glow: "glow 1.2s alternate infinite",
      },

      gridTemplateColumns: {
        sidebar: "260px auto",
        player: "1fr 3fr 1fr",
        explore: "repeat(auto-fill, minmax(180px, 1fr))",
      },

      gridTemplateRows: {
        layout: "auto 1fr auto",
      },

      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
      },

      backgroundImage: {
        "spotify-gradient":
          "linear-gradient(to bottom right, #1DB954, #121212)",
        "glass-dark":
          "linear-gradient(to bottom, rgba(18,18,18,0.8), rgba(18,18,18,0.4))",
        "hero-dots":
          "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          lg: "2rem",
          xl: "3rem",
        },
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
