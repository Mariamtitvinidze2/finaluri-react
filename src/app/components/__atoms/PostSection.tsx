import React, { useState, useEffect, useRef } from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaVideo, FaRegSmile, FaThumbsUp, FaComment, FaImage, FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
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

const PostSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("Friends");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      const updatedLikes = await toggleLike(postId, currentUserId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
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

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "Public":
        return "🌎";
      case "Only me":
        return "🔒";
      default:
        return "👥";
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
    <div className="max-w-[550px] mx-auto">

      <div className='bg-white rounded-lg shadow-md p-3 mb-4'>
        <div className='flex gap-3 items-center border-b pb-3'>
          <Image 
            src={DefaultProfilePic} 
            alt='Profile' 
            width={40} 
            height={40} 
            className='rounded-full object-cover border border-gray-200'
          />
          <input 
            className='bg-gray-100 p-2 rounded-full w-full focus:outline-none cursor-pointer hover:bg-gray-200 transition pl-4'
            type="text" 
            placeholder="What's on your mind?" 
            onClick={() => setIsModalOpen(true)}
            readOnly
          />
        </div>
        <div className='flex justify-between pt-2 px-2'>
          <button className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'>
            <FaVideo className='text-red-500 text-lg'/> Live video
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'
          >
            <MdPhotoLibrary className='text-green-500 text-lg'/> Photo/video
          </button>
          <button className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'>
            <FaRegSmile className='text-yellow-500 text-lg'/> Feeling/activity
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white w-[500px] rounded-lg shadow-lg overflow-hidden'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-bold'>{editingPostId ? "Edit post" : "Create post"}</h2>
              <IoClose 
                className='text-2xl cursor-pointer text-gray-500 hover:bg-gray-100 p-1 rounded-full transition' 
                onClick={() => { 
                  setIsModalOpen(false); 
                  setImage(null); 
                  setEditingPostId(null);
                  setText("");
                }} 
              />
            </div>
            <div className='flex gap-3 items-center p-4'>
              <Image 
                src={DefaultProfilePic} 
                alt='Profile' 
                width={40} 
                height={40} 
                className='rounded-full object-cover border border-gray-200'
              />
              <div>
                <span className='font-medium block'>User Name</span>
                <select 
                  className='text-xs text-gray-500 border-none bg-gray-100 rounded p-1 cursor-pointer hover:bg-gray-200 transition'
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  <option value="Friends">Friends ▼</option>
                  <option value="Public">Public</option>
                  <option value="Only me">Only me</option>
                </select>
              </div>
            </div>
            <textarea 
              className='w-full min-h-[100px] p-4 text-lg border-none focus:outline-none resize-none placeholder-gray-500'
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            {image && (
              <div className='relative mx-4 mb-4 border border-gray-200 rounded-lg overflow-hidden'>
                <Image
                  src={image} 
                  alt='Selected' 
                  width={500}
                  height={300}
                  className='w-full max-h-[400px] object-contain bg-gray-100'
                />
                <button 
                  onClick={() => setImage(null)}
                  className='absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition'
                >
                  <IoClose size={20} />
                </button>
              </div>
            )}
            <div className='flex justify-between items-center p-3 mx-3 mb-3 border border-gray-200 rounded-lg bg-gray-50'>
              <span className='font-medium text-gray-700 ml-1'>Add to your post</span>
              <div className='flex gap-1'>
                <button 
                  onClick={triggerFileInput}
                  className='text-green-600 hover:bg-gray-200 p-2 rounded-full transition'
                  title="Photo"
                >
                  <FaImage size={20} />
                </button>
              </div>
            </div>
            <input 
              type='file' 
              accept='image/*' 
              onChange={handleImageChange} 
              ref={fileInputRef}
              className='hidden'
            />
            <div className='p-3 border-t'>
              <button 
                onClick={handlePost} 
                className={`w-full py-2.5 rounded-md font-medium text-white transition
                  ${text.trim() || image ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!text.trim() && !image}
              >
                {editingPostId ? "Update Post" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='space-y-4'>
        {posts.map((post) => (
          <div key={post.id} className='bg-white p-4 rounded-lg shadow-md'>
         
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Image 
                  src={DefaultProfilePic} 
                  alt='Profile' 
                  width={40} 
                  height={40} 
                  className='rounded-full object-cover border border-gray-200'
                />
                <div>
                  <p className='font-medium'>User Name</p>
                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span>{getPrivacyIcon(post.privacy)} {post.privacy}</span>
                  </div>
                </div>
              </div>
              <div className='relative group'>
                <button className='text-gray-500 hover:bg-gray-100 p-2 rounded-full transition'>
                  <FaEllipsisH />
                </button>
                <div className='absolute right-0 top-8 bg-white shadow-lg rounded-md py-1 w-40 z-10 hidden group-hover:block'>
                  <button 
                    onClick={() => handleEditPost(post)}
                    className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left'
                  >
                    <FaEdit className='text-blue-500' /> Edit
                  </button>
                  <button 
                    onClick={() => post.id && handleDeletePost(post.id)}
                    className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left'
                  >
                    <FaTrash className='text-red-500' /> Delete
                  </button>
                </div>
              </div>
            </div>
            <p className='mb-3'>{post.text}</p>
            {post.image && (
              <Image
                width={500}
                height={300}
                src={post.image} 
                alt='Post' 
                className='w-full rounded-lg border border-gray-200 mb-3'
              />
            )}
            <div className='flex items-center justify-between text-gray-500 border-t pt-2'>
              <button 
                onClick={() => post.id && handleLike(post.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition ${
                  post.likes.includes(currentUserId) ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <FaThumbsUp className={post.likes.includes(currentUserId) ? 'text-blue-500' : ''} />
                <span>
                  {post.likes.includes(currentUserId) ? "Liked" : "Like"}
                  {post.likes.length > 0 && ` · ${post.likes.length}`}
                </span>
              </button>
              <button 
                onClick={() => post.id && toggleComments(post.id)}
                className='flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition text-gray-500'
              >
                <FaComment />
                <span>Comment</span>
              </button>
            </div>
            {post.id && showComments[post.id] && (
              <div className='mt-3 border-t pt-3'>
                <div className='space-y-3 mb-3'>
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className='flex gap-2 group'>
                      <Image 
                        src={DefaultProfilePic} 
                        alt='Profile' 
                        width={22} 
                        height={2} 
                        className='rounded-full object-cover border border-gray-200'
                      />
                      <div className='bg-gray-100 rounded-lg p-2 flex-1 relative'>
                        <p className='font-medium text-sm'>User Name</p>
                        <p className='text-sm'>{comment.text}</p>
                        <div className='flex items-center gap-2 mt-1'>
                          <button 
                            onClick={() => comment.id && handleCommentLike(post.id!, comment.id)}
                            className={`text-xs ${
                              comment.likes?.includes(currentUserId) 
                                ? 'text-blue-500 font-medium' 
                                : 'text-gray-500'
                            }`}
                          >
                            Like
                          </button>
                          {comment.likes?.length > 0 && (
                            <span className='text-xs text-gray-500'>
                              {comment.likes.length}
                            </span>
                          )}
                          <span className='text-xs text-gray-500'>{comment.timestamp}</span>
                        </div>
                        <button 
                          onClick={() => comment.id && post.id && handleDeleteComment(post.id, comment.id)}
                          className='absolute -right-2 -top-2 bg-gray-200 text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                          title="Delete comment"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex gap-2 items-center'>
                  <Image 
                    src={DefaultProfilePic} 
                    alt='Profile' 
                    width={32} 
                    height={32} 
                    className='rounded-full object-cover border border-gray-200'
                  />
                  <div className='flex-1 flex gap-2'>
                    <input
                      type='text'
                      placeholder='Write a comment...'
                      className='flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm focus:outline-none'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && post.id && handleAddComment(post.id)}
                    />
                    <button 
                      onClick={() => post.id && handleAddComment(post.id)}
                      className='text-blue-500 hover:text-blue-600'
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSection;