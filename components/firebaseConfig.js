import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCujNY5mZH7neIrTaKS5lzNKwrfqg9y_4M",
    authDomain: "chatapp-ef8f8.firebaseapp.com",
    projectId: "chatapp-ef8f8",
    storageBucket: "chatapp-ef8f8.appspot.com",
    messagingSenderId: "599937948595",
    appId: "1:599937948595:web:32651c8e81380899eb89c6"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };