import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050810",
          900: "#0A0F1E",
          850: "#0E1525",
          800: "#131C30",
          700: "#1A2540",
          600: "#243352",
        },
        teal: {
          DEFAULT: "#00D4FF",
          50: "#E6FBFF",
          100: "#CCF7FF",
          200: "#99EFFF",
          300: "#66E3FF",
          400: "#33D9FF",
          500: "#00D4FF",
          600: "#00A9CC",
          700: "#007E99",
          800: "#005466",
          900: "#002A33",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
