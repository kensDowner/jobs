const SW_VERSION = "kens-jobs-fcm-v1";

importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js"
);

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBK8rLm-6L3a1PycWKS4S6jeoNLV282SJg",
  authDomain: "kensington-work-orders.firebaseapp.com",
  projectId: "kensington-work-orders",
  storageBucket: "kensington-work-orders.firebasestorage.app",
  messagingSenderId: "707805815423",
  appId: "1:707805815423:web:59a8744b54ea34e5aa554a"
};

firebase.initializeApp(
  FIREBASE_CONFIG
);

const messaging =
  firebase.messaging();

self.addEventListener(
  "install",
  function(event) {
    console.log(
      "[Service Worker] Installing:",
      SW_VERSION
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  function(event) {
    console.log(
      "[Service Worker] Activated:",
      SW_VERSION
    );

    event.waitUntil(
      self.clients.claim()
    );
  }
);

messaging.onBackgroundMessage(
  function(payload) {
    console.log(
      "[Service Worker] Firebase background message:",
      payload
    );

    const notification =
      payload.notification || {};

    const data =
      payload.data || {};

    const title =
      notification.title ||
      data.title ||
      "Kensington Work Orders";

    const options = {
      body:
        notification.body ||
        data.body ||
        "You have a new Work Order.",

      data: {
        url:
          data.url ||
          "./"
      },

      tag:
        data.tag ||
        "kens-work-order",

      renotify: true
    };

    return self.registration.showNotification(
      title,
      options
    );
  }
);

self.addEventListener(
  "notificationclick",
  function(event) {
    event.notification.close();

    const notificationData =
      event.notification.data || {};

    const targetUrl =
      new URL(
        notificationData.url || "./",
        self.registration.scope
      ).href;

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(function(windowClients) {
          for (
            let index = 0;
            index < windowClients.length;
            index += 1
          ) {
            const client =
              windowClients[index];

            if (
              client.url === targetUrl &&
              "focus" in client
            ) {
              return client.focus();
            }
          }

          if (
            self.clients.openWindow
          ) {
            return self.clients.openWindow(
              targetUrl
            );
          }

          return null;
        })
    );
  }
);
