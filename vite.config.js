import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "strip-console-log",
      transform(code, id) {
        if (
          id.endsWith(".js") ||
          id.endsWith(".jsx") 
        ) {
          return code.replace(/console\.log\([^)]*\);?/g, "");
        }
      },
    },
  ],
});
