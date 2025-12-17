import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure we resolve to the source directory if needed,
      // though default resolution usually works for this structure
    },
  },
});
