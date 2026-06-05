export const formatDistance = (distance) => {
  if (distance < 1) return `${Math.round(distance * 1000)}m away`;
  return `${Math.round(distance)}km away`;
};

export const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getCompatibilityColor = (score) => {
  if (score >= 85) return 'text-emerald-600 bg-emerald-50';
  if (score >= 70) return 'text-primary-600 bg-primary-50';
  if (score >= 50) return 'text-accent-600 bg-accent-50';
  return 'text-slate-600 bg-slate-100';
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const generateId = () => Math.random().toString(36).substring(2, 15);
