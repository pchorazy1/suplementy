let state = null;
let notificationSchedule = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('message', (e) => {
  if (e.data.type === 'UPDATE_STATE') {
    state = e.data.state;
    scheduleNotifications();
  }
});

function scheduleNotifications() {
  if (!state || !state.notifEnabled || !state.supplements) return;

  if (notificationSchedule) clearTimeout(notificationSchedule);

  notificationSchedule = setInterval(() => {
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    state.supplements.forEach(sup => {
      if (sup.enabled && sup.time === timeStr && sup.name.trim()) {
        self.registration.showNotification('Pora na suplement! 💊', {
          body: sup.name,
          icon: '💊',
          badge: '💊',
          tag: 'suplement-' + sup.id,
          requireInteraction: false
        });
      }
    });
  }, 60000);
}

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length > 0) clients[0].focus();
  }));
});
