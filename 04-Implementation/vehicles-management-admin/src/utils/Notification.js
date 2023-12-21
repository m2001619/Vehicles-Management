// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import axios from 'axios';
import ApiConfigs from '../api/apiConfigs';

const vapidKey = 'BFyoljYgmnxSJk1jZ4rSVZT1Gi0-Xei2hBFJBTcvKVo-ygPZ4-kOLlkimTej6VCkKzHZY-3eKy8waSfPYz92qx4';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB8jTUw8tRVknJ1Fd7TmVvpSxyhc5D4NDc',
  authDomain: 'vehicle-management-dc9c0.firebaseapp.com',
  projectId: 'vehicle-management-dc9c0',
  storageBucket: 'vehicle-management-dc9c0.appspot.com',
  messagingSenderId: '983179771379',
  appId: '1:983179771379:web:64d794ded97c677510e686',
  measurementId: 'G-43JCBWSY8X'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export async function initializeMessage(t) {
  try {
    if (!sessionStorage.getItem('notification-token')) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey });
        sessionStorage.setItem('notification-token', token);
        await setNotificationToken(token);
      } else {
        toast.warning(t('Please Accept the notification permission to get the requested from the users'));
      }
    }
  } catch (e) {
    console.log(e);
    console.log('Error in initializeMessage');
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Set Notification Token
async function setNotificationToken(notificationToken) {
  const token = sessionStorage.getItem('token');
  try {
    await axios({
      method: 'PATCH',
      url: ApiConfigs.User.setNotificationToken,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        token: notificationToken
      }
    });
  } catch (e) {
    console.log(e);
  }
}
