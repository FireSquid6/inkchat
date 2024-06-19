import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigpaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "client",
  plugins: [react(), tsconfigpaths()]
})
