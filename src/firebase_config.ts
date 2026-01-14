import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "finance-management-syste-fdaf8.firebaseapp.com",
  projectId: "finance-management-syste-fdaf8",
  storageBucket: "finance-management-syste-fdaf8.firebasestorage.app",
  messagingSenderId: "39118453692",
  appId: "1:39118453692:web:cb79bb8f95fbaa8cfd49b9",
  measurementId: "G-74XXL17NHV"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
export const db: Firestore = getFirestore(app);

export default app;

