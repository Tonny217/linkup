import express from 'express';

const router = express.Router();

const events = [
  {
    id: 'event_1',
    title: 'Singles Hike - Kilimanjaro View',
    location: 'Arusha',
    date: '2024-01-20',
    time: '06:00 AM',
    type: 'Outdoor',
    price: 15000,
    currency: 'TZS',
    attendees: ['user_2'],
    max_attendees: 20,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
    description: 'Morning hike with breathtaking views of Kilimanjaro.'
  },
  {
    id: 'event_2',
    title: 'Tech Professionals Mixer',
    location: 'Dar es Salaam',
    date: '2024-01-25',
    time: '18:30 PM',
    type: 'Networking',
    price: 25000,
    currency: 'TZS',
    attendees: ['user_1'],
    max_attendees: 50,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    description: 'Evening networking event for tech professionals.'
  },
  {
    id: 'event_3',
    title: 'Beach Cleanup & Social',
    location: 'Zanzibar',
    date: '2024-02-01',
    time: '08:00 AM',
    type: 'Volunteering',
    price: 0,
    currency: 'TZS',
    attendees: ['user_3'],
    max_attendees: 30,
    image: 'https://images.unsplash.com/photo-1618477461853-5f8dd68aa395?w=400&h=300&fit=crop',
    description: 'Give back to the community while meeting like-minded people.'
  }
];

router.get('/', (req, res) => {
  res.json({ events, total: events.length });
});

router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

router.post('/:id/join', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { userId } = req.body;
  if (!event.attendees.includes(userId)) {
    event.attendees.push(userId);
  }
  res.json({ success: true, event });
});

export default router;
