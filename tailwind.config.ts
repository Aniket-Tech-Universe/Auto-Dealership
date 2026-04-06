import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 16% 90%)",
        input: "hsl(220 16% 96%)",
        ring: "hsl(220 12% 30%)",
        background: "hsl(210 20% 98%)",
        foreground: "hsl(220 19% 12%)",
        muted: { DEFAULT: "hsl(220 20% 96%)", foreground: "hsl(220 10% 40%)" },
        card: { DEFAULT: "hsl(0 0% 100%)", foreground: "hsl(220 19% 12%)" },
        primary: { DEFAULT: "hsl(220 36% 18%)", foreground: "hsl(210 40% 98%)" }
      },
      boxShadow: { soft: "0 1px 2px rgba(15,23,42,.04), 0 10px 30px rgba(15,23,42,.06)" }
    }
  },
  plugins: []
};
export default config;
