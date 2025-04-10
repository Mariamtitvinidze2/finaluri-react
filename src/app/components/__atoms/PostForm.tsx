import React, { useRef } from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaImage } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


interface PostFormProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  text: string;
  setText: (value: string) => void;
  image: string | null;
  setImage: (value: string | null) => void;
  privacy: string;
  setPrivacy: (value: string) => void;
  editingPostId: string | null;
  handlePost: () => Promise<void>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: string;
}

const PostForm: React.FC<PostFormProps> = ({
  isModalOpen,
  setIsModalOpen,
  text,
  setText,
  image,
  setImage,
  privacy,
  setPrivacy,
  editingPostId,
  handlePost,
  handleImageChange,
  theme
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isModalOpen) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className={`w-[500px] rounded-lg shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex justify-between items-center p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{editingPostId ? "Edit post" : "Create post"}</h2>
          <IoClose 
            className={`text-2xl cursor-pointer p-1 rounded-full transition ${
              theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
            }`} 
            onClick={() => { 
              setIsModalOpen(false); 
              setImage(null); 
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
            <span className={`font-medium block ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>User Name</span>
            <select 
              className={`text-xs border-none rounded p-1 cursor-pointer hover:bg-opacity-80 transition ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
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
          className={`w-full min-h-[100px] p-4 text-lg border-none focus:outline-none resize-none ${
            theme === 'dark' 
              ? 'bg-gray-800 text-white placeholder-gray-400' 
              : 'bg-white placeholder-gray-500'
          }`}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {image && (
          <div className={`relative mx-4 mb-4 rounded-lg overflow-hidden ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } border`}>
            <Image
              src={image} 
              alt='Selected' 
              width={500}
              height={300}
              className='w-full max-h-[400px] object-contain bg-gray-100'
            />
            <button 
              onClick={() => setImage(null)}
              className={`absolute top-2 right-2 text-white rounded-full p-1 hover:bg-opacity-70 transition ${
                theme === 'dark' ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-800 bg-opacity-50'
              }`}
            >
              <IoClose size={20} />
            </button>
          </div>
        )}
        <div className={`flex justify-between items-center p-3 mx-3 mb-3 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        } border`}>
          <span className={`font-medium ml-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Add to your post</span>
          <div className='flex gap-1'>
            <button 
              onClick={triggerFileInput}
              className={`hover:bg-opacity-20 p-2 rounded-full transition ${
                theme === 'dark' ? 'text-green-400 hover:bg-gray-600' : 'text-green-600 hover:bg-gray-200'
              }`}
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
  );
};

export default PostForm;