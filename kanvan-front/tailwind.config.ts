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
        // Redefine los colores que puedan estar causando el problema con un formato seguro
        // Por ejemplo, si un plugin usa `oklch`, puedes forzarlo a usar `rgb`
        "your-color-name": "rgb(100, 50, 200)",
      },
    },
  },
  plugins: [], // Asegúrate de que tus plugins están aquí
};
export default config;
