// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-fondo": "rgb(var(--color-fondo-rgb) / <alpha-value>)",
        "color-texto": "rgb(var(--color-texto-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [], // Asegúrate de que tus plugins están aquí
};
export default config;
