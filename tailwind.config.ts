import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 16% 90%)",
        input: "hsl(220 16% 96%)",
        ring: "hsl(220 20% 30%)",
        background: "hsl(210 24% 98%)",
        foreground: "hsl(222 28% 12%)",
        muted: {
          DEFAULT: "hsl(210 20% 96%)",
          foreground: "hsl(215 12% 43%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222 28% 12%)"
        },
        primary: {
          DEFAULT: "hsl(222 36% 18%)",
          foreground: "hsl(210 40% 98%)"
        },
        success: {
          DEFAULT: "hsl(146 50% 36%)",
          foreground: "hsl(0 0% 100%)"
        },
        warning: {
          DEFAULT: "hsl(38 92% 50%)",
          foreground: "hsl(222 28% 12%)"
        },
        danger: {
          DEFAULT: "hsl(0 72% 50%)",
          foreground: "hsl(0 0% 100%)"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.04), 0 12px 32px rgba(15,23,42,.06)"
      }
    }
  },
  plugins: []
};

export default config;
