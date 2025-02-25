import path from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import swc from "unplugin-swc";
import { defineConfig, PluginOption } from "vite";

import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.js"),
    },
    emptyOutDir: false,
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), "react/jsx-runtime"],
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    swc.vite(),
    swc.rollup({
      minify: true,
    }) as PluginOption,
    dts({ insertTypesEntry: true }),
  ],
});
