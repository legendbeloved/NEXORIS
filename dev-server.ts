import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createApiApp } from "./backend/api";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function start() {
  const app = createApiApp();
  const port = Number(process.env.PORT || 3008);

  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.VITE_HMR_PORT ? { port: parseInt(process.env.VITE_HMR_PORT) } : undefined,
    },
    appType: "spa",
  });

  app.use(vite.middlewares);

  app.listen(port, "0.0.0.0", () => {
    console.log(`\n🚀 NEXORIS Mission Control Active`);
    console.log(`📡 Dashboard: http://localhost:${port}\n`);
  });
}

start();
