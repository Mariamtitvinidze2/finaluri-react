import React, { useState, useEffect} from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaVideo, FaRegSmile, } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";

import { useTheme } from "../../ThemeContext";
import { 
  addPostToFirestore, 
  fetchPostsFromFirestore, 
  toggleLike,
  toggleCommentLike,
  updatePostInFirestore, 
  deletePostFromFirestore, 
  addCommentToFirestore, 
  fetchCommentsFromFirestore,
  deleteCommentFromFirestore,
  Post,
  Comment,
} from "../../firebaseService";
import PostForm from '../__atoms/PostForm';
import PostItem from '../__atoms/PostItem';

const PostSection: React.FC = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("Friends");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<string>("");
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUserId] = useState("user1"); 

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPostsFromFirestore();
      setPosts(fetchedPosts);
      
      const commentsObj: { [key: string]: Comment[] } = {};
      for (const post of fetchedPosts) {
        if (post.id) {
          commentsObj[post.id] = await fetchCommentsFromFirestore(post.id);
        }
      }
      setComments(commentsObj);
    };
    loadPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (text || image) {
      if (editingPostId) {
        await updatePostInFirestore(editingPostId, text, image, privacy);
        setEditingPostId(null);
      } else {
        await addPostToFirestore(text, image, privacy);
      }
      
      setText("");
      setImage(null);
      setIsModalOpen(false);
      
      const updatedPosts = await fetchPostsFromFirestore();
      setPosts(updatedPosts);
      const commentsObj: { [key: string]: Comment[] } = {};
      for (const post of updatedPosts) {
        if (post.id) {
          commentsObj[post.id] = await fetchCommentsFromFirestore(post.id);
        }
      }
      setComments(commentsObj);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.includes(currentUserId);
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== currentUserId)
                : [...post.likes, currentUserId]
            };
          }
          return post;
        })
      );
      
      await toggleLike(postId, currentUserId);
      
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentLike = async (postId: string, commentId: string) => {
    try {
      const updatedLikes = await toggleCommentLike(postId, commentId, currentUserId);
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment => 
          comment.id === commentId ? { ...comment, likes: updatedLikes } : comment
        )
      }));
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id || null);
    setText(post.text);
    setImage(post.image);
    setPrivacy(post.privacy);
    setIsModalOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostFromFirestore(postId);
        setPosts(posts.filter(post => post.id !== postId));
    
        setComments(prev => {
          const newComments = {...prev};
          delete newComments[postId];
          return newComments;
        });
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const toggleComments = async (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    if (!comments[postId]) {
      const postComments = await fetchCommentsFromFirestore(postId);
      setComments(prev => ({
        ...prev,
        [postId]: postComments
      }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (newComment.trim()) {
      try {
        await addCommentToFirestore(postId, newComment);
        setNewComment("");
        
        const updatedComments = await fetchCommentsFromFirestore(postId);
        setComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteCommentFromFirestore(postId, commentId);
        const updatedComments = await fetchCommentsFromFirestore(postId);
        setComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div className={`max-w-[550px] mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className={`rounded-lg shadow-md p-3 mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex gap-3 items-center border-b pb-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Image 
            src={DefaultProfilePic} 
            alt='Profile' 
            width={40} 
            height={40} 
            className='rounded-full object-cover border border-gray-200'
          />
          <input 
            className={`p-2 rounded-full w-full focus:outline-none cursor-pointer transition pl-4 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 placeholder-gray-400' 
                : 'bg-gray-100 hover:bg-gray-200 placeholder-gray-500'
            }`}
            type="text" 
            placeholder="What's on your mind?" 
            onClick={() => setIsModalOpen(true)}
            readOnly
          />
        </div>
        <div className='flex justify-between pt-2 px-2'>
          <button className={`flex items-center gap-1 p-2 rounded-lg text-sm ${
            theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            <FaVideo className='text-red-500 text-lg'/> Live video
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className={`flex items-center gap-1 p-2 rounded-lg text-sm ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MdPhotoLibrary className='text-green-500 text-lg'/> Photo/video
          </button>
          <button className={`flex items-center gap-1 p-2 rounded-lg text-sm ${
            theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            <FaRegSmile className='text-yellow-500 text-lg'/> Feeling/activity
          </button>
        </div>
      </div>

      <PostForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        text={text}
        setText={setText}
        image={image}
        setImage={setImage}
        privacy={privacy}
        setPrivacy={setPrivacy}
        editingPostId={editingPostId}
        handlePost={handlePost}
        handleImageChange={handleImageChange}
        theme={theme}
      />

      <div className='space-y-4'>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            theme={theme}
            handleLike={handleLike}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
            toggleComments={toggleComments}
            showComments={showComments}
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            handleCommentLike={handleCommentLike}
            handleDeleteComment={handleDeleteComment}
          />
        ))}
      </div>
    </div>
  );
};

export default PostSection;