import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export interface Post {
  id?: string;
  text: string;
  image: string | null;
  privacy: string;
  timestamp: string;
  likes: string[];
}

export interface Comment {
  id?: string;
  postId: string;
  text: string;
  timestamp: string;
  likes: string[];
}

export const addPostToFirestore = async (
  text: string,
  image: string | null,
  privacy: string
): Promise<void> => {
  try {
    await addDoc(collection(db, "posts"), {
      text,
      image,
      privacy,
      likes: [],
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
        privacy: data.privacy || "Friends",
        likes: data.likes || [],
        timestamp: formatPostTime(timestamp || new Date()),
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const toggleLike = async (
  postId: string,
  userId: string
): Promise<string[]> => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) return [];

    const postData = postSnap.data() as Post;
    const newLikes = postData.likes.includes(userId)
      ? postData.likes.filter(id => id !== userId)
      : [...postData.likes, userId];

    await updateDoc(postRef, { likes: newLikes });
    return newLikes;
  } catch (error) {
    console.error("Error updating like:", error);
    throw error;
  }
};

export const toggleCommentLike = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<string[]> => {
  try {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    const commentSnap = await getDoc(commentRef);
    
    if (!commentSnap.exists()) return [];

    const commentData = commentSnap.data() as Comment;
    const newLikes = commentData.likes?.includes(userId)
      ? commentData.likes.filter(id => id !== userId)
      : [...(commentData.likes || []), userId];

    await updateDoc(commentRef, { likes: newLikes });
    return newLikes;
  } catch (error) {
    console.error("Error updating comment like:", error);
    throw error;
  }
};

export const updatePostInFirestore = async (
  postId: string,
  text: string,
  image: string | null,
  privacy: string
) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      text,
      image,
      privacy,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePostFromFirestore = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const addCommentToFirestore = async (
  postId: string,
  text: string
) => {
  try {
    await addDoc(collection(db, "posts", postId, "comments"), {
      text,
      likes: [],
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const fetchCommentsFromFirestore = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.timestamp?.toDate();
      return {
        id: docSnap.id,
        postId,
        text: data.text,
        likes: data.likes || [],
        timestamp: formatPostTime(timestamp || new Date()),
      };
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const deleteCommentFromFirestore = async (
  postId: string,
  commentId: string
) => {
  try {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
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