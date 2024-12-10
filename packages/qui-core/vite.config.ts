import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import pkg from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true, logLevel: "info" })],
  css: {
    postcss: {
      plugins: [],
    },
  },

  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "QuiCore",
      //fileName: "qui-core",
      //formats: ["es", "umd"],
      //formats: ["es", "umd"],
      //fileName: (format) => `qui-core.${format}.js`,
    },

    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-router-dom",
        "file-saver",
        "date-fns",
        "react-dom/server",
        /node_modules/,
      ],
      //external: Object.keys((pkg as any).peerDependencies || {}),
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
          "file-saver": "saveAs",
          "date-fns": "dateFns",
          "react-dom/server": "ReactDOMServer",
        },
      },
    },
  },
});
