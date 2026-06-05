import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Check, Zap, Star, Eye, Filter, MessageCircle, Globe, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';

export default function Premium({ onBack, onPurchase }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly',
      price: 5000,
      period: 'week',
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: 15000,
      period: 'month',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 120000,
      period: 'year',
      popular: false,
      savings: '33% off'
    }
  ];

  const features = [
    { icon: MessageCircle, text: 'Unlimited messages' },
    { icon: Eye, text: 'See who liked you' },
    { icon: Filter, text: 'Advanced filters' },
    { icon: Star, text: '5 Super Likes per day' },
    { icon: Zap, text: 'Priority profile placement' },
    { icon: Globe, text: 'Location change' },
  ];

  const plan = plans.find(p => p.id === selectedPlan);

  return (
    <div className="page-container">
      <TopBar title="Premium" showBack onBack={onBack} />

      <div className="px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <Crown size={36} className="text-white fill-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upgrade to Premium</h2>
          <p className="text-sm text-slate-500">Unlock the full LinkUp experience</p>
        </div>

        {/* Plans */}
        <div className="flex gap-3 mb-8">
          {plans.map(p => (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(p.id)}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all relative ${
                selectedPlan === p.id 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-slate-200 bg-white'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full">
                  POPULAR
                </span>
              )}
              <p className="text-sm font-semibold text-slate-900 mb-1">{p.name}</p>
              <p className="text-2xl font-bold text-slate-900">
                TZS {p.price.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">/{p.period}</p>
              {p.savings && (
                <p className="text-xs font-semibold text-emerald-600 mt-1">{p.savings}</p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-5 card-shadow mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Premium Features</h3>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <f.icon size={16} className="text-primary-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{f.text}</span>
                <Check size={16} className="text-emerald-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-5 card-shadow mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Payment Methods</h3>
          <div className="space-y-2">
            {['M-Pesa (Vodacom)', 'Airtel Money', 'Tigo Pesa', 'Bank Card'].map((method, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-600">{method[0]}</span>
                </div>
                <span className="text-sm font-medium text-slate-700">{method}</span>
                <ChevronRight size={16} className="text-slate-300 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPayment(true)}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl transition-all"
        >
          Upgrade for TZS {plan.price.toLocaleString()}
        </motion.button>
        <p className="text-center text-xs text-slate-400 mt-3">
          Cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Complete Payment">
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-xl text-center">
            <p className="text-sm text-primary-700 mb-1">LinkUp Premium - {plan.name}</p>
            <p className="text-2xl font-bold text-primary-900">TZS {plan.price.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Phone Number</label>
            <input 
              type="tel" 
              placeholder="2557XX XXX XXX"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Network</label>
            <select className="input-field">
              <option>Vodacom M-Pesa</option>
              <option>Airtel Money</option>
              <option>Tigo Pesa</option>
            </select>
          </div>
          <button 
            onClick={() => { setShowPayment(false); onPurchase(); }}
            className="btn-primary w-full"
          >
            Pay with M-Pesa
          </button>
          <p className="text-xs text-slate-500 text-center">
            You will receive an STK push on your phone to complete payment.
          </p>
        </div>
      </Modal>
    </div>
  );
}
