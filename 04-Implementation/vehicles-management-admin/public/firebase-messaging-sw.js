importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

//the Firebase config object
const firebaseConfig = {
  apiKey: 'AIzaSyB8jTUw8tRVknJ1Fd7TmVvpSxyhc5D4NDc',
  authDomain: 'vehicle-management-dc9c0.firebaseapp.com',
  projectId: 'vehicle-management-dc9c0',
  storageBucket: 'vehicle-management-dc9c0.appspot.com',
  messagingSenderId: '983179771379',
  appId: '1:983179771379:web:64d794ded97c677510e686',
  measurementId: 'G-43JCBWSY8X'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
