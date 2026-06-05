import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'linkup-secret-key-change-in-production';

// In-memory store (replace with PocketBase/PostgreSQL in production)
const users = new Map();

// Telegram auth
router.post('/telegram', async (req, res) => {
  try {
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.body;

    // Validate Telegram hash (implement proper validation in production)
    // For now, accept the data
    const userId = `tg_${id}`;

    let user = users.get(userId);
    if (!user) {
      user = {
        id: userId,
        name: `${first_name} ${last_name || ''}`.trim(),
        username,
        photo_url,
        telegram_id: id,
        created_at: new Date().toISOString(),
        verified: true,
        verification_level: 'basic',
        premium: false,
        profile: {
          age: null,
          gender: null,
          location: null,
          profession: null,
          education: null,
          interests: [],
          goals: null,
          bio: '',
          photos: photo_url ? [photo_url] : [],
          voice_intro: false,
          video_intro: false,
          community: null,
          highlights: [],
          online: true
        }
      };
      users.set(userId, user);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        photo_url: user.photo_url,
        verified: user.verified,
        premium: user.premium,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Phone auth (simplified)
router.post('/phone', async (req, res) => {
  try {
    const { phone, code } = req.body;

    // In production: verify SMS code via Twilio/Africa's Talking
    // For demo: accept any 6-digit code
    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const userId = `phone_${phone.replace(/\D/g, '')}`;
    let user = users.get(userId);

    if (!user) {
      user = {
        id: userId,
        name: 'User',
        phone,
        created_at: new Date().toISOString(),
        verified: true,
        verification_level: 'basic',
        premium: false,
        profile: {
          age: null,
          gender: null,
          location: null,
          profession: null,
          education: null,
          interests: [],
          goals: null,
          bio: '',
          photos: [],
          voice_intro: false,
          video_intro: false,
          community: null,
          highlights: [],
          online: true
        }
      };
      users.set(userId, user);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        verified: user.verified,
        premium: user.premium,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify token
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      photo_url: user.photo_url,
      verified: user.verified,
      premium: user.premium,
      profile: user.profile
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
