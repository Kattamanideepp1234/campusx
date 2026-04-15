/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#06131f",
        panel: "rgba(10, 24, 39, 0.68)",
        neon: "#62f6ff",
        skywave: "#4f7cff",
        pulse: "#8b5cf6",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(98, 246, 255, 0.16)",
        glass: "0 24px 60px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 28%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.28), transparent 24%), linear-gradient(135deg, #03111f 0%, #091a33 45%, #120d2e 100%)",
      },
    },
  },
  plugins: [],
};
