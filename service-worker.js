const SW_VERSION = "kens-jobs-v1";

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing:", SW_VERSION);
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated:", SW_VERSION);

  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received");

  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      data = {
        body: event.data.text()
      };
    }
  }

  const title = data.title || "Kensington Work Orders";
  const options = {
    body: data.body || "You have a new Work Order.",
    data: {
      url: data.url || "./"
    },
    tag: data.tag || "kens-work-order",
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification.data &&
    event.notification.data.url
      ? event.notification.data.url
      : "./";

  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
