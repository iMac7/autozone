import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import vercel from "vite-plugin-vercel"

export default defineConfig({
  plugins: [react(), vercel()],
  build: {
    target: "es2022"
  },
  base:"/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
