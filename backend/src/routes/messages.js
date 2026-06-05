import express from 'express';

const router = express.Router();

router.get('/:matchId', (req, res) => {
  res.json({ messages: [] });
});

export default router;
