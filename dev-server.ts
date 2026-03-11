import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createApiApp } from "./backend/api";
import fs from "node:fs";
import path from "node:path";

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
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const htmlPath = path.resolve(process.cwd(), "index.html");
      const template = fs.readFileSync(htmlPath, "utf-8");
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      try {
        vite.ssrFixStacktrace(e as Error);
      } catch {}
      next(e);
    }
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`\n🚀 NEXORIS Mission Control Active`);
    console.log(`📡 Dashboard: http://localhost:${port}\n`);
  });
}

start();
