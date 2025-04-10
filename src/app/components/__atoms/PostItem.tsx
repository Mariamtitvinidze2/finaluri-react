import React from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaThumbsUp, FaComment, FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";

import { Post, Comment } from "../../firebaseService";

interface PostItemProps {
  post: Post;
  currentUserId: string;
  theme: string;
  handleLike: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  handleDeletePost: (postId: string) => void;
  toggleComments: (postId: string) => void;
  showComments: { [key: string]: boolean };
  comments: { [key: string]: Comment[] };
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: (postId: string) => void;
  handleCommentLike: (postId: string, commentId: string) => void;
  handleDeleteComment: (postId: string, commentId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  currentUserId,
  theme,
  handleLike,
  handleEditPost,
  handleDeletePost,
  toggleComments,
  showComments,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleCommentLike,
  handleDeleteComment
}) => {
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

  return (
    <div key={post.id} className={`p-4 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
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
            <p className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Mari titvinidze</p>
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>{post.timestamp}</span>
              <span>•</span>
              <span>{getPrivacyIcon(post.privacy)} {post.privacy}</span>
            </div>
          </div>
        </div>
        <div className='relative group'>
          <button className={`p-2 rounded-full transition ${
            theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
          }`}>
            <FaEllipsisH />
          </button>
          <div className={`absolute right-0 top-8 shadow-lg rounded-md py-1 w-40 z-10 hidden group-hover:block ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          }`}>
            <button 
              onClick={() => handleEditPost(post)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaEdit className='text-blue-500' /> 
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Edit</span>
            </button>
            <button 
              onClick={() => post.id && handleDeletePost(post.id)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaTrash className='text-red-500' /> 
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Delete</span>
            </button>
          </div>
        </div>
      </div>
      <p className={`mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{post.text}</p>
      
      {post.image && (
        <div 
          className="relative mb-3"
          onDoubleClick={() => post.id && handleLike(post.id)}
        >
          <Image
            width={500}
            height={300}
            src={post.image} 
            alt='Post' 
            className={`w-full rounded-lg ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } border`}
          />
          {post.likes.includes(currentUserId) && (
            <FaThumbsUp className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-4xl opacity-80" />
          )}
        </div>
      )}
      <div className={`flex items-center justify-between border-t pt-2 ${
        theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
      }`}>
        <button 
          onClick={() => post.id && handleLike(post.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } ${
            post.likes.includes(currentUserId) ? 'text-blue-500' : ''
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
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <FaComment />
          <span>Comment</span>
        </button>
      </div>
      {post.id && showComments[post.id] && (
        <div className={`mt-3 pt-3 ${
          theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-200'
        }`}>
          <div className='space-y-3 mb-3'>
            {comments[post.id]?.map((comment) => (
              <div key={comment.id} className='flex gap-2 group'>
                <Image 
                  src={DefaultProfilePic} 
                  alt='Profile' 
                  width={32} 
                  height={32} 
                  className='rounded-full object-cover border border-gray-200'
                />
                <div className={`rounded-lg p-2 flex-1 relative ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <p className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>User Name</p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>{comment.text}</p>
                  <div className='flex items-center gap-2 mt-1'>
                    <button 
                      onClick={() => comment.id && handleCommentLike(post.id!, comment.id)}
                      className={`text-xs ${
                        comment.likes?.includes(currentUserId) 
                          ? 'text-blue-500 font-medium' 
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Like
                    </button>
                    {comment.likes?.length > 0 && (
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {comment.likes.length}
                      </span>
                    )}
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>{comment.timestamp}</span>
                  </div>
                  <button 
                    onClick={() => comment.id && post.id && handleDeleteComment(post.id, comment.id)}
                    className={`absolute -right-2 -top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}
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
                className={`flex-1 rounded-full px-3 py-1 text-sm focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && post.id && handleAddComment(post.id)}
              />
              <button 
                onClick={() => post.id && handleAddComment(post.id)}
                className={`${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;