import { defineConfig, loadEnv } from "vite";
import { vavite } from "vavite";
import { swc } from "rollup-plugin-swc3";
import react from '@vitejs/plugin-react';
import devtoolsJson from 'vite-plugin-devtools-json';
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());
  const port = parseInt(env.VITE_PORT || "3000", 10);
  const host = env.VITE_HOST || "localhost";
  
  return {
    server: {
      host,
      port,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    buildSteps: [
      {
        name: "client",
        config: {
          build: {
            outDir: "dist/client",
            manifest: true,
            // rollupOptions: { input: "entry-client.tsx" },
          },
        },
      },
      {
        name: "server",
        config: {
          build: {
            ssr: true,
            outDir: "dist/server",
          },
        },
      },
    ],
    ssr: {
      external: ["reflect-metadata"],
    },
    esbuild: false,
    plugins: [
      react(),
      devtoolsJson(),
      {
        ...swc({
          jsc: {
            transform: {
              decoratorMetadata: true,
              legacyDecorator: true,
            },
            target: "es2021",
          },
        }),
        enforce: "pre", // Make sure this is applied before anything else
      },
      vavite({
        handlerEntry: "/src/main.ts",
        serveClientAssetsInDev: true,
      }),
      {
        name: "warmup",
        configureServer(server) {
          server.httpServer?.once("listening", () => {
            console.log("\n ✅ Vite dev server started\n");
            // 在此执行预热逻辑
            if (mode === "development") {
              const apiPrefix = env.VITE_API_PREFIX;
              const baseURL = `http://${host}:${port}`;
              const warmupURL = `${baseURL}${apiPrefix}/status`;
              fetch(warmupURL)
                .then(res => {
                  if (res.ok) {
                    console.log("\n✅ Vite dev server warmup request success！\n");
                  } else {
                    console.error("\n⚠️ Warmup interface returns non-200 status:", res.status + "\n");
                  }
                })
                .catch(err => {
                  console.error("\n❌ Warmup request failed:", err.message + "\n");
                });
            }
          });
        }
      },
    ],
  }
});
