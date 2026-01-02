// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkq6R_PrCGpzlbXk78LqsvA0oZ9HDRq_M",
    authDomain: "cavallin-tcg-store-6f43b.firebaseapp.com",
    projectId: "cavallin-tcg-store-6f43b",
    storageBucket: "cavallin-tcg-store-6f43b.firebasestorage.app",
    messagingSenderId: "907909707357",
    appId: "1:907909707357:web:8c54c41aec3b39caaf3fb4"
};

// Inicializa o app apenas uma vez
const app = initializeApp(firebaseConfig);

// Exporta as instâncias para serem usadas nos hooks e services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;