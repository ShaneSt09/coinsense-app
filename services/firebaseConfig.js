// services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBOKn4kwaoURRZC99IFyKhWUpNUIWBAmsM',
  authDomain: 'coinsense-a73b1.firebaseapp.com',
  projectId: 'coinsense-a73b1',
  storageBucket: 'coinsense-a73b1.appspot.com',
  messagingSenderId: '646069949865',
  appId: '1:646069949865:web:4838756baa4a69b3c9e0b8'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
