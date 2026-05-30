/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#090d0a",
        appRaised: "#0f1612",
        panel: "#131a16",
        panelSoft: "#18211c",
        panelStrong: "#1f2a23",
        content: "#f2f5f2",
        muted: "#9ca89f",
        line: "rgba(255,255,255,0.08)",
        primary: "#66a939",
        primaryStrong: "#7ec94c",
        primaryDark: "#2d3d33",
        danger: "#ff6b6b",
        warning: "#f4b860",
        info: "#6fb1ff",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 16px 40px rgba(0,0,0,0.28)",
        glow: "0 14px 40px rgba(102,169,57,0.16)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "app-glow":
          "radial-gradient(circle at top, rgba(102,169,57,0.14), transparent 28%), linear-gradient(180deg, #0a0d0b 0%, #090d0a 100%)",
      },
    },
  },
  plugins: [],
};
