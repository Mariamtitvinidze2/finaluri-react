import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
export interface Post {
  id?: string;
  text: string;
  image: string | null;
  likes: number;
  privacy: string;
  timestamp: string;
  reaction?: string;
}
export const addPostToFirestore = async (
  text: string,
  image: string | null,
  privacy: string
) => {
  try {
    await addDoc(collection(db, "posts"), {
      text,
      image,
      privacy,
      likes: 0,
      reaction: "", 
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};
export const fetchPostsFromFirestore = async (): Promise<Post[]> => {
  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.timestamp?.toDate();
      return {
        id: docSnap.id,
        text: data.text,
        image: data.image || null,
        likes: data.likes || 0,
        privacy: data.privacy || "Friends",
        reaction: data.reaction || "",
        timestamp: formatPostTime(timestamp || new Date()),
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
export const updateReactionInFirestore = async (
  postId: string,
  reaction: string | null
) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      reaction: reaction || "",
    });
  } catch (error) {
    console.error("Error updating reaction:", error);
    throw error;
  }
};
const formatPostTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });
};







