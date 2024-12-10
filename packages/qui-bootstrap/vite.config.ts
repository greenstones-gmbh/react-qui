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
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "QuiBootstrap",
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
        "react-bootstrap",
        "react-router-dom",
        "classnames",
        "@clickapp/qui-core",
        "react-hook-form",
        "react-icons/bs",
        "react-icons/tb",
        /node_modules/,
      ],

      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
          "react-bootstrap": "ReactBootstrap",
          "react-hook-form": "ReactHookForm",
          "react-router-dom": "ReactRouterDOM",
          classnames: "classNames",
          "@clickapp/qui-core": "ClickappQuiCore",
          "react-is": "ReactIs",
          "object-assign": "Object.assign",
          "react-icons/bs": "BsIcons",
          "react-icons/tb": "TbIcons",
        },
      },
    },
  },
});
