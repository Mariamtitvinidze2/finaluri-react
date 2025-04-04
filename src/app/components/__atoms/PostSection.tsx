import React, { useState, useEffect, useRef } from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaVideo, FaRegSmile, FaThumbsUp, FaComment, FaImage, FaUserTag, FaMapMarkerAlt, FaGift } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { addPostToFirestore, fetchPostsFromFirestore } from "../../firebaseService";

interface Post {
  id?: string;
  text: string;
  image: string | null;
  likes: number;
  privacy: string;
  timestamp: string;
  reaction?: string;
}

const PostSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isButtonOpen, setIsButtonOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("Friends");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reactions = [
    { type: "Like", emoji: "👍" },
    { type: "Love", emoji: "❤️" },
    { type: "Care", emoji: "🤗" },
    { type: "Haha", emoji: "😂" },
    { type: "Wow", emoji: "😮" },
    { type: "Sad", emoji: "😢" },
    { type: "Angry", emoji: "😡" }
  ];

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPostsFromFirestore();
      setPosts(fetchedPosts);
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
      await addPostToFirestore(text, image, privacy); 
      setText("");
      setImage(null);
      setIsModalOpen(false);
      setIsButtonOpen(false);
      const updatedPosts = await fetchPostsFromFirestore();
      setPosts(updatedPosts);
    }
  };

  const handleReaction = (index: number, type: string) => {
    setPosts(prevPosts => {
      const newPosts = [...prevPosts];
      newPosts[index].reaction = type;
      return newPosts;
    });
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
            placeholder="What's on your mind, Mari?" 
            onClick={() => setIsModalOpen(true)}
            readOnly
          />
        </div>
        <div className='flex justify-between pt-2 px-2'>
          <button className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'>
            <FaVideo className='text-red-500 text-lg'/> Live video
          </button>
          <button 
            onClick={() => setIsButtonOpen(true)} 
            className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'
          >
            <MdPhotoLibrary className='text-green-500 text-lg'/> Photo/video
          </button>
          <button className='flex items-center gap-1 text-gray-600 hover:bg-gray-100 p-2 rounded-lg text-sm'>
            <FaRegSmile className='text-yellow-500 text-lg'/> Feeling/activity
          </button>
        </div>
      </div>
      {(isModalOpen || isButtonOpen) && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white w-[500px] rounded-lg shadow-lg overflow-hidden'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-bold'>Create post</h2>
              <IoClose 
                className='text-2xl cursor-pointer text-gray-500 hover:bg-gray-100 p-1 rounded-full transition' 
                onClick={() => { setIsModalOpen(false); setIsButtonOpen(false); setImage(null); }} 
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
                <span className='font-medium block'>Mari Titvinidze</span>
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
              placeholder="What's on your mind, Mari?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            {image && (
              <div className='relative mx-4 mb-4 border border-gray-200 rounded-lg overflow-hidden'>
                <Image
                  src={image} 
                  alt='Selected' 
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
                  <div className='flex items-center justify-center w-8 h-8'>
                    <FaImage size={20} />
                  </div>
                </button>
                <button className='text-yellow-600 hover:bg-gray-200 p-2 rounded-full transition'>
                  <div className='flex items-center justify-center w-8 h-8'>
                    <FaUserTag size={20} />
                  </div>
                </button>
                <button className='text-yellow-500 hover:bg-gray-200 p-2 rounded-full transition'>
                  <div className='flex items-center justify-center w-8 h-8'>
                    <FaRegSmile size={20} />
                  </div>
                </button>
                <button className='text-red-500 hover:bg-gray-200 p-2 rounded-full transition'>
                  <div className='flex items-center justify-center w-8 h-8'>
                    <FaMapMarkerAlt size={20} />
                  </div>
                </button>
                <button className='text-blue-500 hover:bg-gray-200 p-2 rounded-full transition'>
                  <div className='flex items-center justify-center w-8 h-8'>
                    <FaGift size={20} />
                  </div>
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
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='space-y-4'>
        {posts.map((post, index) => (
          <div key={post.id || index} className='bg-white p-4 rounded-lg shadow-md'>
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
                  <p className='font-medium'>Mari Titvinidze</p>
                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span>{getPrivacyIcon(post.privacy)} {post.privacy}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className='mb-3'>{post.text}</p>
            {post.image && (
              <Image
              width={500} // Set a fixed width
    height={300}  
                src={post.image} 
                alt='Post' 
                className='w-full rounded-lg border border-gray-200 mb-3'
              />
            )}
            <div className='flex items-center justify-between text-gray-500 border-t pt-2'>
              <div className='relative group'>
                <button className='flex items-center gap-1 hover:text-blue-500 transition'>
                  <FaThumbsUp className={`${post.reaction ? 'text-blue-500' : ''}`} />
                  <span>{post.reaction ? reactions.find(r => r.type === post.reaction)?.emoji : "Like"}</span>
                </button>
                <div className='absolute -top-12 left-0 bg-white border border-gray-200 rounded-full shadow-lg p-1 hidden group-hover:flex gap-1 z-10'>
                  {reactions.map((reaction) => (
                    <button 
                      key={reaction.type}
                      onClick={() => handleReaction(index, reaction.type)}
                      className='text-xl hover:scale-110 transition-transform duration-150'
                      title={reaction.type}
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </div>
              </div>
              <button className='flex items-center gap-1 hover:text-blue-500 transition'>
                <FaComment />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSection;
