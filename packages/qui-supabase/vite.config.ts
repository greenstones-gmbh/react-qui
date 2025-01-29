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
      name: "QuiSupabase",
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
        "@supabase/supabase-js",
        "@supabase/auth-ui-shared",
        "@supabase/auth-ui-react",
        /node_modules/,
      ],

      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "react/jsx-runtime",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
          classnames: "classNames",
          "@clickapp/qui-core": "ClickappQuiCore",
          "@supabase/supabase-js": "supabase",
          "@supabase/auth-ui-shared": "auth_ui_shared",
          "@supabase/auth-ui-react": "auth_ui_react",
        },
      },
    },
  },
});
