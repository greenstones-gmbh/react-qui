import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true, logLevel: "info" })],
  css: {
    postcss: {
      plugins: [],
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "QuiCore",
      //fileName: "qui-core",
      //formats: ["es", "umd"],
      //formats: ["es", "umd"],
      //fileName: (format) => `qui-core.${format}.js`,
    },

    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
