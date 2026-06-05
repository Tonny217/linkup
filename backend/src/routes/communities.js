import express from 'express';

const router = express.Router();

const communities = [
  { id: 'it', name: 'IT Professionals', members: 1240, description: 'Developers, designers, and tech enthusiasts', color: 'blue', trending: true },
  { id: 'entrepreneurs', name: 'Entrepreneurs', members: 856, description: 'Business owners and startup founders', color: 'amber', trending: true },
  { id: 'teachers', name: 'Teachers', members: 643, description: 'Educators shaping the future', color: 'emerald', trending: false },
  { id: 'healthcare', name: 'Healthcare Workers', members: 920, description: 'Doctors, nurses, and medical staff', color: 'red', trending: false },
  { id: 'students', name: 'University Students', members: 2100, description: 'Students from universities across Tanzania', color: 'purple', trending: true },
  { id: 'parents', name: 'Single Parents', members: 432, description: 'Supportive community for single parents', color: 'pink', trending: false },
  { id: 'sports', name: 'Sports Lovers', members: 1567, description: 'Football, basketball, athletics fans', color: 'orange', trending: false },
  { id: 'arts', name: 'Artists & Creatives', members: 734, description: 'Musicians, painters, writers, dancers', color: 'indigo', trending: false }
];

router.get('/', (req, res) => {
  res.json({ communities, total: communities.length });
});

router.post('/:id/join', (req, res) => {
  const community = communities.find(c => c.id === req.params.id);
  if (!community) return res.status(404).json({ error: 'Community not found' });
  res.json({ success: true, community });
});

export default router;
