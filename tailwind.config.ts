import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // ─── Avid Trainings Brand Colors ──────────────────────
        teal: {
          DEFAULT: "#00685f",
          hover:   "#008378",
          light:   "#e0f2f1",
          accent:  "#ffffff",
          muted:   "#89f5e7",
        },
        navy: {
          DEFAULT: "#191c1e",
          dark:    "#131b2e",
          mid:     "#1B2A4A",
        },
        surface: {
          DEFAULT: "#f7f9fb",
          low:     "#f2f4f6",
          mid:     "#eceef0",
          high:    "#e6e8ea",
          highest: "#e0e3e5",
          white:   "#ffffff",
        },
        text: {
          DEFAULT: "#191c1e",
          body:    "#3d4947",
          muted:   "#6d7a77",
        },
        // ─── Stitch Color Names ────────────────────────────────
        "primary":                    "#00685f",
        "primary-container":          "#008378",
        "on-primary":                 "#ffffff",
        "on-primary-fixed":           "#00201d",
        "on-primary-fixed-variant":   "#005049",
        "on-primary-container":       "#f4fffc",
        "primary-fixed":              "#89f5e7",
        "primary-fixed-dim":          "#6bd8cb",
        "inverse-primary":            "#6bd8cb",
        "surface-tint":               "#006a61",
        "secondary":                  "#565e74",
        "secondary-container":        "#dae2fd",
        "on-secondary":               "#ffffff",
        "on-secondary-fixed":         "#131b2e",
        "on-secondary-fixed-variant": "#3f465c",
        "on-secondary-container":     "#5c647a",
        "secondary-fixed":            "#dae2fd",
        "secondary-fixed-dim":        "#bec6e0",
        "tertiary":                   "#006947",
        "tertiary-container":         "#00855b",
        "on-tertiary":                "#ffffff",
        "on-tertiary-fixed":          "#002113",
        "on-tertiary-fixed-variant":  "#005236",
        "on-tertiary-container":      "#f5fff6",
        "tertiary-fixed":             "#ffffff",
        "tertiary-fixed-dim":         "#4edea3",
        "background":                 "#f7f9fb",
        "on-background":              "#191c1e",
        "surface-bright":             "#f7f9fb",
        "surface-dim":                "#d8dadc",
        "surface-variant":            "#e0e3e5",
        "on-surface":                 "#191c1e",
        "on-surface-variant":         "#3d4947",
        "inverse-surface":            "#2d3133",
        "inverse-on-surface":         "#eff1f3",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f2f4f6",
        "surface-container":          "#eceef0",
        "surface-container-high":     "#e6e8ea",
        "surface-container-highest":  "#e0e3e5",
        "outline":                    "#6d7a77",
        "outline-variant":            "#bcc9c6",
        "error":                      "#ba1a1a",
        "on-error":                   "#ffffff",
        "error-container":            "#ffdad6",
        "on-error-container":         "#93000a",
      },

      fontFamily: {
        sans:     ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:     ["var(--font-jetbrains-mono)", "monospace"],
        headline: ["var(--font-inter)", "system-ui", "sans-serif"],
        body:     ["var(--font-inter)", "system-ui", "sans-serif"],
        label:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      borderRadius: {
        sm:    "0.25rem",
        DEFAULT: "0.5rem",
        md:    "0.625rem",
        lg:    "0.75rem",
        xl:    "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        full:  "9999px",
      },

      boxShadow: {
        teal:         "0 4px 24px rgba(0, 104, 95, 0.12)",
        "teal-lg":    "0 8px 40px rgba(0, 104, 95, 0.18)",
        card:         "0 2px 16px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 32px rgba(15, 23, 42, 0.10)",
        glass:        "0 32px 64px -16px rgba(15, 23, 42, 0.08)",
      },

      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        logoPulse: {
          "0%, 100%": { opacity: "1",   transform: "scale(1)" },
          "50%":      { opacity: "0.6", transform: "scale(0.92)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        progressBar: {
          "0%":   { width: "0%",   opacity: "1" },
          "80%":  { width: "85%",  opacity: "1" },
          "100%": { width: "100%", opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
      animation: {
        "fade-in":        "fadeIn 0.5s ease-out",
        "fade-in-up":     "fadeInUp 0.5s ease-out forwards",
        "slide-in-left":  "slideInLeft 0.4s ease-out",
        "logo-pulse":     "logoPulse 1.6s ease-in-out infinite",
        "shimmer":        "shimmer 2s linear infinite",
        "progress-bar":   "progressBar 2s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "float":          "float 3s ease-in-out infinite",
        "pulse-slow":     "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee":        "marquee 25s linear infinite",
      },

      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-teal":    "linear-gradient(135deg, #00685f 0%, #008378 100%)",
        "gradient-navy":    "linear-gradient(135deg, #191c1e 0%, #131b2e 100%)",
        "gradient-surface": "radial-gradient(circle at 70% 30%, #e0f2f1 0%, transparent 50%)",
        "shimmer-gradient": "linear-gradient(90deg, #f2f4f6 25%, #e6e8ea 50%, #f2f4f6 75%)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;