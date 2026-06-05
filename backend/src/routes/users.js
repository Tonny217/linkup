import express from 'express';

const router = express.Router();

// Mock users database (replace with PocketBase)
const mockUsers = [
  {
    id: 'user_1',
    name: 'Amara Okafor',
    age: 26,
    gender: 'female',
    location: 'Dar es Salaam',
    profession: 'Software Engineer',
    education: 'University of Dar es Salaam',
    interests: ['Coding', 'Hiking', 'Photography', 'Afrobeats'],
    goals: 'Long-term relationship',
    bio: 'Tech enthusiast who loves weekend hikes and capturing city sunsets.',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop'],
    voice_intro: true,
    video_intro: false,
    verified: true,
    verification_level: 'premium',
    distance: 2.4,
    compatibility: 92,
    community: 'IT Professionals',
    highlights: ['Built a fintech app', 'Marathon runner', 'Speaks 3 languages'],
    online: true
  },
  {
    id: 'user_2',
    name: 'Juma Abdallah',
    age: 29,
    gender: 'male',
    location: 'Arusha',
    profession: 'Wildlife Photographer',
    education: 'College',
    interests: ['Nature', 'Camping', 'Swahili poetry', 'Coffee'],
    goals: 'Marriage',
    bio: 'Capturing the beauty of East Africa one shot at a time.',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'],
    voice_intro: true,
    video_intro: true,
    verified: true,
    verification_level: 'basic',
    distance: 5.1,
    compatibility: 87,
    community: 'Entrepreneurs',
    highlights: ['Published photographer', 'Coffee farm owner'],
    online: false
  },
  {
    id: 'user_3',
    name: 'Fatima Hassan',
    age: 24,
    gender: 'female',
    location: 'Zanzibar',
    profession: 'Marine Biologist',
    education: 'MS',
    interests: ['Diving', 'Conservation', 'Cooking', 'Yoga'],
    goals: 'Serious relationship',
    bio: 'Ocean conservationist by day, spice market explorer by weekend.',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop'],
    voice_intro: false,
    video_intro: true,
    verified: true,
    verification_level: 'premium',
    distance: 1.2,
    compatibility: 94,
    community: 'Healthcare Workers',
    highlights: ['PADI certified', 'Published research', 'Yoga instructor'],
    online: true
  }
];

// Get all users with filters
router.get('/', (req, res) => {
  const { location, min_age, max_age, community, goal, verified_only } = req.query;

  let filtered = [...mockUsers];

  if (location && location !== 'All') {
    filtered = filtered.filter(u => u.location === location);
  }
  if (min_age) filtered = filtered.filter(u => u.age >= parseInt(min_age));
  if (max_age) filtered = filtered.filter(u => u.age <= parseInt(max_age));
  if (community && community !== 'All') filtered = filtered.filter(u => u.community === community);
  if (goal && goal !== 'All') filtered = filtered.filter(u => u.goals === goal);
  if (verified_only === 'true') filtered = filtered.filter(u => u.verified);

  res.json({ users: filtered, total: filtered.length });
});

// Get single user
router.get('/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update profile
router.put('/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  Object.assign(user, req.body);
  res.json({ success: true, user });
});

// Like a user
router.post('/:id/like', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Simulate match (30% chance)
  const isMatch = Math.random() > 0.7;
  res.json({ success: true, matched: isMatch, user });
});

// Super like
router.post('/:id/superlike', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ success: true, matched: true, superLike: true, user });
});

export default router;
