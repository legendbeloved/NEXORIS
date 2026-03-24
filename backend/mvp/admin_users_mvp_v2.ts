import express from 'express';
export const adminUsersMvpRouter = express.Router();

const users = [
  { id: 1, name: 'Alice Admin', email: 'alice@example.com' },
  { id: 2, name: 'Bob User', email: 'bob@example.com' },
];

adminUsersMvpRouter.get('/users', (_req, res) => {
  res.json({ users });
});

export default adminUsersMvpRouter;
