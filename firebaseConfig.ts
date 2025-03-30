import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "AIzaSyDO2tqXpcbNHwH53HeDo0kkDS4d1jqX1-w",  
  authDomain: "facebook-d0758.firebaseapp.com",
  projectId: "facebook-d0758",
  storageBucket: "facebook-d0758.firebasestorage.app",
  messagingSenderId: "448375691499",
  appId: "1:448375691499:web:affd5c839268acdbbd46ae",
  measurementId: "G-JGXK3EW616"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;