import { createApiApp } from "../backend/api";

const app = createApiApp();

export default function handler(req: any, res: any) {
  return app(req as any, res as any);
}
