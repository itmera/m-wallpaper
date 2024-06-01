import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "./",
  server:{
    proxy:{
      '/app4':{
        target:'http://d.paper.i4.cn',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/app4/,'')
      },
      '/api':{
        target:'http://app4.i4.cn',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/api/,'')
      }
    }
  }
});
