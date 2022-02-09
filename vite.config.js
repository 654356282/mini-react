/*
 * :file description: 
 * :name: /mini-react/vite.config.js
 * :author: 翁鸿添
 * :copyright: (c) 2021, Tungee
 * :date created: 2021-08-20 16:01:48
 * :last editor: 翁鸿添
 * :date last edited: 2021-08-20 16:53:39
 */
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 3001
  }
});
