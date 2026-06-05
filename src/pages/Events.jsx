import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ChevronRight, Ticket, Star } from 'lucide-react';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { api } from '../services/api';

export default function Events({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setEvents(api.getEvents());
  }, []);

  const filtered = events.filter(e => {
    if (filter === 'all') return true;
    return e.type.toLowerCase() === filter.toLowerCase();
  });

  const handleJoin = (eventId) => {
    api.joinEvent(eventId);
    setEvents(api.getEvents());
    setSelectedEvent(null);
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'networking', label: 'Networking' },
    { id: 'volunteering', label: 'Volunteering' },
  ];

  return (
    <div className="page-container">
      <TopBar title="Events" subtitle="Local meetups & socials" />

      {/* Categories */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === cat.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 space-y-4 pb-4">
        {filtered.map((event, index) => (
          <motion.button
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEvent(event)}
            className="w-full bg-white rounded-2xl overflow-hidden card-shadow text-left hover:shadow-md transition-all"
          >
            <div className="relative h-40">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full">
                  {event.type}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                <div className="flex items-center gap-3 text-white/80 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {event.attendees.length}/{event.maxAttendees}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {event.price === 0 ? (
                    <span className="text-sm font-bold text-emerald-600">Free</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-900">
                      TZS {event.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Check back soon for upcoming events in your area"
        />
      )}

      {/* Event Detail Modal */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
        {selectedEvent && (
          <div>
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedEvent.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-slate-700">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={18} className="text-slate-400" />
                <span className="text-slate-700">{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-slate-400" />
                <span className="text-slate-700">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users size={18} className="text-slate-400" />
                <span className="text-slate-700">{selectedEvent.attendees.length} attending (max {selectedEvent.maxAttendees})</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Ticket size={18} className="text-slate-400" />
                <span className="text-slate-700 font-semibold">
                  {selectedEvent.price === 0 ? 'Free entry' : `TZS ${selectedEvent.price.toLocaleString()}`}
                </span>
              </div>
            </div>

            <button 
              onClick={() => handleJoin(selectedEvent.id)}
              className="btn-primary w-full"
            >
              {selectedEvent.price > 0 ? 'Buy Ticket' : 'Join Event'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
