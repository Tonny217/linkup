import express from 'express';

const router = express.Router();

const matches = [];
const messages = [];

router.get('/', (req, res) => {
  res.json({ matches, total: matches.length });
});

router.post('/', (req, res) => {
  const match = {
    id: `match_${Date.now()}`,
    ...req.body,
    created_at: new Date().toISOString(),
    unread: 0
  };
  matches.push(match);
  res.json({ success: true, match });
});

router.get('/:matchId/messages', (req, res) => {
  const matchMessages = messages.filter(m => m.match_id === req.params.matchId);
  res.json({ messages: matchMessages });
});

router.post('/:matchId/messages', (req, res) => {
  const message = {
    id: `msg_${Date.now()}`,
    match_id: req.params.matchId,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  messages.push(message);
  res.json({ success: true, message });
});

export default router;
