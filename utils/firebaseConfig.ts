import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1uZNYB_HQdu20QwE9TmaTf5v_pIHL6M4",
  authDomain: "savemymoment-g2-firebase.firebaseapp.com",
  projectId: "savemymoment-g2-firebase",
  storageBucket: "savemymoment-g2-firebase.appspot.com",
  messagingSenderId: "596648308005",
  appId: "1:596648308005:web:b4c5f17a80dcdbcc2abecc",
  measurementId: "G-WFQTM0Q3ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
