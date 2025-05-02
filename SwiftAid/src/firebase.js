// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAfJUQblT6Y6iGi78v6rfxT3XKHNRuDCw",
  authDomain: "swiftaid-ebb01.firebaseapp.com",
  projectId: "swiftaid-ebb01",
  storageBucket: "swiftaid-ebb01.appspot.com",
  messagingSenderId: "182978780114",
  appId: "1:182978780114:web:0a533aece5e0f75a27c60b",
  measurementId: "G-P2LB1D8S8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export the initialized services
export { auth, db, storage, googleProvider };
export default app;
