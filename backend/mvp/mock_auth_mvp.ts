import express from "express";
export const authMvpRouter = express.Router();
authMvpRouter.get("/ping", (req, res) => res.json({ ok: true, endpoint: "auth-mvp" }));
