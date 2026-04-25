import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        // Direct hex values matching CSS variables
        'zk-base': '#030308',
        'zk-surface': '#080812',
        'zk-elevated': '#0D0D1A',
        'zk-border': '#1A1A2E',
        'zk-border-active': '#2A2A4E',
        'zk-text': '#E8E8FF',
        'zk-text-secondary': '#6666AA',
        'zk-text-muted': '#333355',
        'neon-red': '#FF003C',
        'neon-blue': '#00C8FF',
        'neon-purple': '#8B00FF',
        'neon-gold': '#FFD700',
        'neon-green': '#00FF88',
        'neon-orange': '#FF6B00',
        // Faction colors
        'naruto': '#FF6B00',
        'jjk': '#8B00FF',
        'onepiece': '#00C8FF',
        'bleach': '#00FF88',
        'blackclover': '#FFD700',
        'dragonball': '#FF003C',
        'demonslayer': '#FF003C',
        'hxh': '#00FF88',
        'physical': '#999999',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
