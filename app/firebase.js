// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB4Um5V80UDMhJOxO-OfgiMt-cGmFArhLA",
  authDomain: "swiftship-3b2e7.firebaseapp.com",
  projectId: "swiftship-3b2e7",
  storageBucket: "swiftship-3b2e7.appspot.com",
  messagingSenderId: "679545932117",
  appId: "1:679545932117:web:7f987a3d467de2bfcec7dc",
  measurementId: "G-J1SJHM63R5"
};

// ✅ Initialize Firebase app only once
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// ✅ Initialize Auth for React Native with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  // If already initialized, reuse existing instance
  auth = app.auth ? app.auth() : null;
}

// Google Auth Provider
const provider = new GoogleAuthProvider();

export { app, auth, provider };
