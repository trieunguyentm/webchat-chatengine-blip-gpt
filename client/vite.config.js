import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Sử dụng plugin react() , thay đường dẫn đến /src thành @
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
