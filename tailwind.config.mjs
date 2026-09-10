/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        graveyard: {
          950: "#040507",
          900: "#07080b",
          850: "#0b0d13",
          800: "#10121a",
          750: "#151823",
          700: "#1c202e",
          600: "#272c3d",
          500: "#4b5368",
          400: "#7b849b",
          300: "#a9b1c6",
          200: "#d1d6e4",
          100: "#f1f3f9",
        },
        tombstone: {
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(255, 255, 255, 0.20)",
          surface: "rgba(13, 15, 21, 0.85)",
          elevated: "rgba(19, 22, 34, 0.90)",
        },
        status: {
          active: "#10b981",
          atRisk: "#f59e0b",
          abandoned: "#f97316",
          dead: "#ef4444",
          offline: "#6b7280",
          zombie: "#a855f7",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      backgroundImage: {
        "radial-fog": "radial-gradient(circle at 50% 10%, rgba(30, 36, 56, 0.45) 0%, rgba(7, 8, 11, 0.95) 70%)",
        "grave-glow": "radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.12) 0%, transparent 60%)",
        "archive-grid": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "flicker": "flicker 3s infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "70%": { opacity: "0.95" },
          "85%": { opacity: "0.75" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
