import { defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      hmr: {
        port: 5173,
        protocol: "ws",
        host: "localhost",
        clientPort: 5173,
      },
      watch: {
        usePolling: true,  // <-- fallback 설정
        interval: 100,
      },
      proxy: {
        "/api": {
          target: env.BACKEND_URL || "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
  };
});