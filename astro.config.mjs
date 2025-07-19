// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  outDir: `./dist`,
  vite: {
    build: {
      minify: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    }
  },
  integrations: [react()]
});
