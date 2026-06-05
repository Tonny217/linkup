import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Shield, AlertTriangle, Mic, Image as ImageIcon } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { formatTime } from '../utils/helpers';

const iceBreakers = [
  "What's your favorite travel destination?",
  "What do you do for fun on weekends?",
  "What's your dream business idea?",
  "Coffee or tea person?",
  "What's the best book you've read recently?",
];

export default function Chat({ match, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSafety, setShowSafety] = useState(false);
  const [showIceBreakers, setShowIceBreakers] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (match) {
      const msgs = api.getMessages(match.id);
      setMessages(msgs);
    }
  }, [match]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !match) return;
    const msg = api.sendMessage(match.id, input.trim(), 'me');
    setMessages(prev => [...prev, msg]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "That's interesting! Tell me more.",
        "I love that! We should discuss it more.",
        "Haha, same here!",
        "Really? That's amazing!",
        "I'd love to hear more about that.",
      ];
      const reply = api.sendMessage(match.id, replies[Math.floor(Math.random() * replies.length)], 'them');
      setMessages(prev => [...prev, reply]);
    }, 2000 + Math.random() * 3000);
  };

  const handleIceBreaker = (text) => {
    setShowIceBreakers(false);
    const msg = api.sendMessage(match.id, text, 'me');
    setMessages(prev => [...prev, msg]);
  };

  if (!match) return null;

  return (
    <div className="page-container flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 safe-top">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              <ArrowLeft size={22} className="text-slate-700" />
            </button>
            <div className="relative">
              <img 
                src={match.user.photos[0]} 
                alt={match.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {match.user.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">{match.user.name}</h1>
              <p className="text-xs text-slate-500">
                {match.user.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-slate-100">
              <Phone size={20} className="text-slate-600" />
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-100">
              <Video size={20} className="text-slate-600" />
            </button>
            <button 
              onClick={() => setShowSafety(true)}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <MoreVertical size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send size={24} className="text-primary-400" />
            </div>
            <p className="text-sm text-slate-500 mb-4">Start the conversation with {match.user.name}</p>
            <button 
              onClick={() => setShowIceBreakers(true)}
              className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full hover:bg-primary-100 transition-all"
            >
              Try an Ice Breaker
            </button>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ChatBubble message={msg} isMe={msg.sender === 'me'} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white p-3 safe-bottom">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100">
            <ImageIcon size={20} className="text-slate-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100">
            <Mic size={20} className="text-slate-400" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 input-field py-2.5"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Safety Modal */}
      <Modal isOpen={showSafety} onClose={() => setShowSafety(false)} title="Safety Options">
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl text-left hover:bg-red-100 transition-all">
            <AlertTriangle size={20} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Report User</p>
              <p className="text-xs text-red-700">Report harassment or inappropriate behavior</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left hover:bg-slate-100 transition-all">
            <Shield size={20} className="text-slate-600" />
            <div>
              <p className="font-semibold text-slate-900">Block User</p>
              <p className="text-xs text-slate-600">Hide profile and stop all communication</p>
            </div>
          </button>
          <div className="p-4 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-amber-600" />
              <span className="font-semibold text-amber-900 text-sm">Safety Tip</span>
            </div>
            <p className="text-xs text-amber-800">
              Always meet in public places for the first time. Share your location with a trusted friend.
            </p>
          </div>
        </div>
      </Modal>

      {/* Ice Breakers */}
      <Modal isOpen={showIceBreakers} onClose={() => setShowIceBreakers(false)} title="Ice Breakers">
        <div className="space-y-3">
          {iceBreakers.map((text, i) => (
            <button
              key={i}
              onClick={() => handleIceBreaker(text)}
              className="w-full p-4 bg-slate-50 rounded-xl text-left hover:bg-primary-50 hover:text-primary-700 transition-all"
            >
              <p className="font-medium text-sm">{text}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
