import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  startAt, 
  endAt, 
  limit, 
  getDocs,
  doc, 
  getDoc 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDO2tqXpcbNHwH53HeDo0kkDS4d1jqX1-w",
  authDomain: "facebook-d0758.firebaseapp.com",
  projectId: "facebook-d0758",
  storageBucket: "facebook-d0758.appspot.com",
  messagingSenderId: "448375691499",
  appId: "1:448375691499:web:affd5c839268acdbbd46ae",
  measurementId: "G-JGXK3EW616"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const searchUsers = async (searchTerm: string) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    orderBy("name"),
    startAt(searchTerm),
    endAt(searchTerm + "\uf8ff"),
    limit(10)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getUserById = async (userId: string) => {
  const docRef = doc(db, "users", userId); 
  const docSnap = await getDoc(docRef); 
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export default app;