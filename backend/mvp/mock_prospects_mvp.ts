import express from "express";
export const prospectsMvpRouter = express.Router();
prospectsMvpRouter.get("/ping", (req, res) => res.json({ ok: true, endpoint: "prospects-mvp" }));
