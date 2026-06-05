export const initTelegramAuth = () => {
  return new Promise((resolve) => {
    // Simulate Telegram WebApp initialization
    setTimeout(() => {
      resolve({
        id: 'tg_' + Math.random().toString(36).substr(2, 9),
        first_name: 'Telegram',
        last_name: 'User',
        username: 'tg_user',
        photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'simulated_hash'
      });
    }, 1500);
  });
};

export const checkTelegramEnv = () => {
  // Check if running inside Telegram WebApp
  return window.Telegram?.WebApp ? true : false;
};
