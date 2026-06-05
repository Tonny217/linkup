const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// PocketBase helper
async function pbRequest(method, path, data = null, authToken = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = authToken;
  if (POCKETBASE_ADMIN_TOKEN) headers['Authorization'] = `Admin ${POCKETBASE_ADMIN_TOKEN}`;

  const config = {
    method,
    url: `${POCKETBASE_URL}/api${path}`,
    headers,
    ...(data && { data })
  };

  const response = await axios(config);
  return response.data;
}

// Auth middleware
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await pbRequest('GET', '/collections/users/auth-refresh', null, token);
    req.user = user.record;
    req.authToken = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// === AUTH ROUTES ===

// Telegram auth
app.post('/api/auth/telegram', async (req, res) => {
  try {
    const { id, first_name, last_name, username, photo_url, hash } = req.body;

    // TODO: Verify Telegram hash
    // For now, create or update user

    const email = `${id}@telegram.linkup`;
    const password = hash || `${id}_telegram_auth`;

    try {
      // Try to login
      const auth = await pbRequest('POST', '/collections/users/auth-with-password', {
        identity: email,
        password
      });
      res.json(auth);
    } catch {
      // Create new user
      const user = await pbRequest('POST', '/collections/users/records', {
        email,
        password,
        passwordConfirm: password,
        name: `${first_name} ${last_name || ''}`.trim(),
        username: username || `user_${id}`,
        avatar: photo_url,
        verified: true,
        verification_level: 'basic'
      });

      // Login after creation
      const auth = await pbRequest('POST', '/collections/users/auth-with-password', {
        identity: email,
        password
      });
      res.json(auth);
    }
  } catch (error) {
    console.error('Telegram auth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// === USER ROUTES ===

// Get current user
app.get('/api/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await pbRequest('GET', `/collections/users/records/${req.user.id}`, null, req.authToken);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Update user
app.patch('/api/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await pbRequest('PATCH', `/collections/users/records/${req.user.id}`, req.body, req.authToken);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Discover users (with filters)
app.get('/api/users/discover', authMiddleware, async (req, res) => {
  try {
    const { location, minAge, maxAge, community, verified_only, page = 1 } = req.query;

    let filter = `id != "${req.user.id}"`;
    if (location) filter += ` && location = "${location}"`;
    if (minAge) filter += ` && age >= ${minAge}`;
    if (maxAge) filter += ` && age <= ${maxAge}`;
    if (community) filter += ` && community = "${community}"`;
    if (verified_only === 'true') filter += ` && verified = true`;

    const users = await pbRequest('GET', `/collections/users/records?filter=${encodeURIComponent(filter)}&page=${page}&perPage=20`, null, req.authToken);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// === MATCH ROUTES ===

// Get matches
app.get('/api/matches', authMiddleware, async (req, res) => {
  try {
    const filter = `user_a = "${req.user.id}" || user_b = "${req.user.id}"`;
    const matches = await pbRequest('GET', `/collections/matches/records?filter=${encodeURIComponent(filter)}&expand=user_a,user_b`, null, req.authToken);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Create like
app.post('/api/likes', authMiddleware, async (req, res) => {
  try {
    const { to_user, super_like } = req.body;

    // Check if mutual like (match)
    const mutualFilter = `from_user = "${to_user}" && to_user = "${req.user.id}"`;
    const mutualLikes = await pbRequest('GET', `/collections/likes/records?filter=${encodeURIComponent(mutualFilter)}`, null, req.authToken);

    const like = await pbRequest('POST', '/collections/likes/records', {
      from_user: req.user.id,
      to_user,
      super_like: super_like || false
    }, req.authToken);

    // If mutual, create match
    if (mutualLikes.items && mutualLikes.items.length > 0) {
      const match = await pbRequest('POST', '/collections/matches/records', {
        user_a: req.user.id,
        user_b: to_user,
        matched_at: new Date().toISOString(),
        super_like: super_like || false
      }, req.authToken);

      return res.json({ like, match: true, matchId: match.id });
    }

    res.json({ like, match: false });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// === MESSAGE ROUTES ===

// Get messages for a match
app.get('/api/messages/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const filter = `match = "${matchId}"`;
    const messages = await pbRequest('GET', `/collections/messages/records?filter=${encodeURIComponent(filter)}&sort=created&expand=sender`, null, req.authToken);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Send message
app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { match, text } = req.body;

    const message = await pbRequest('POST', '/collections/messages/records', {
      match,
      sender: req.user.id,
      text,
      read: false
    }, req.authToken);

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// === EVENT ROUTES ===

// Get events
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    let filter = '';
    if (type) filter = `type = "${type}"`;

    const events = await pbRequest('GET', `/collections/events/records?${filter ? `filter=${encodeURIComponent(filter)}&` : ''}sort=-event_date`, null, req.authToken);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Join event
app.post('/api/events/:eventId/join', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendee = await pbRequest('POST', '/collections/event_attendees/records', {
      event: eventId,
      user: req.user.id,
      paid: false
    }, req.authToken);

    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// === REPORT ROUTES ===

// Create report
app.post('/api/reports', authMiddleware, async (req, res) => {
  try {
    const { reported_user, reason, details } = req.body;

    const report = await pbRequest('POST', '/collections/reports/records', {
      reporter: req.user.id,
      reported_user,
      reason,
      details,
      status: 'pending'
    }, req.authToken);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// === ADMIN ROUTES ===

// Get pending reports (admin only)
app.get('/api/admin/reports', async (req, res) => {
  try {
    const reports = await pbRequest('GET', '/collections/reports/records?filter=status="pending"&expand=reporter,reported_user', null, `Admin ${POCKETBASE_ADMIN_TOKEN}`);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'linkup-api', pocketbase: POCKETBASE_URL });
});

app.listen(PORT, () => {
  console.log(`LinkUp API Service running on port ${PORT}`);
  console.log(`PocketBase: ${POCKETBASE_URL}`);
});
