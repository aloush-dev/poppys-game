import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        TanStackRouterVite({ autoCodeSplitting: true }),
        react(),
        tailwindcss(),
    ],
    server: {
        port: 8080,
    },
    resolve: {
        alias: {
            "@": path.resolve("./src"),
        },
    },
});

