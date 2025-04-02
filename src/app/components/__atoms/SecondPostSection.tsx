import React, { useState } from 'react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from 'next/image';
import { FaVideo, FaRegSmile } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";

const SecondPostSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false)

  return (
    <div>
    
      <div className='w-[650px] bg-slate-50 rounded-lg shadow-xl p-3'>
        <div className='flex gap-4 items-center border-b pb-3'>
          <Image src={DefaultProfilePic} alt='' width={50} height={50} className='rounded-full'/>
          <input 
            className='bg-slate-200 p-3 rounded-xl w-full h-10 focus:outline-none cursor-pointer' 
            type="text" 
            placeholder="What's on your mind, Mari?" 
            onClick={() => setIsModalOpen(true)}
            readOnly
          />
        </div>
        <div className='flex justify-between pt-3 px-4'>
          <button className='flex items-center gap-2 text-gray-600 hover:bg-gray-200 p-2 rounded-lg'>
            <FaVideo className='text-red-500'/> Live video
          </button>
          <button onClick={() => setIsButtonOpen(true)} className='flex items-center gap-2 text-gray-600 hover:bg-gray-200 p-2 rounded-lg'>
            <MdPhotoLibrary className='text-green-500'/> Photo/video
          </button>
          <button className='flex items-center gap-2 text-gray-600 hover:bg-gray-200 p-2 rounded-lg'>
            <FaRegSmile className='text-yellow-500'/> Feeling/activity
          </button>
        </div>
      </div>
      
      {isModalOpen && (
       <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
       <div className='bg-white w-[500px] rounded-lg shadow-lg'>
         <div className='flex justify-between items-center p-4 border-b'>
           <h2 className='text-xl font-bold'>Create Post</h2>
           <IoClose 
             className='text-2xl cursor-pointer text-gray-500 hover:text-gray-700' 
             onClick={() => setIsModalOpen(false)} 
           />
         </div>
         
         <div className='flex gap-3 items-center p-4'>
           <Image 
             src={DefaultProfilePic} 
             alt='Profile' 
             width={40} 
             height={40} 
             className='rounded-full object-cover'
           />
           <div>
             <span className='font-medium block'>Mari Titvinidze</span>
             <select className='text-xs text-gray-500 border-none bg-gray-100 rounded p-1'>
               <option>Friends</option>
               <option>Public</option>
               <option>Only me</option>
             </select>
           </div>
         </div>
         
         <textarea 
           className='w-full h-32 p-4 text-lg border-none focus:outline-none resize-none' 
           placeholder="What's on your mind, Mari?"
         ></textarea>
         
         <div className='border border-gray-200 mx-4 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50'>
           <BsFillImageFill className='text-3xl text-gray-400 mb-2' />
           <p className='text-gray-600 mb-2'>Add photos/videos</p>
           <p className='text-gray-400 text-sm mb-3'>or drag and drop</p>
           <button className='bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium'>
             Add photos and videos from your mobile device.
           </button>
         </div>
         
         <div className='p-4'>
           <button className='bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md font-medium'>
             Post
           </button>
         </div>
       </div>
     </div>
      )}
      {isButtonOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white w-[500px] rounded-lg shadow-lg'>
          <div className='flex justify-between items-center p-4 border-b'>
            <h2 className='text-xl font-bold'>Create Post</h2>
            <IoClose 
              className='text-2xl cursor-pointer text-gray-500 hover:text-gray-700' 
              onClick={() => setIsButtonOpen(false)} 
            />
          </div>
          
          <div className='flex gap-3 items-center p-4'>
            <Image 
              src={DefaultProfilePic} 
              alt='Profile' 
              width={40} 
              height={40} 
              className='rounded-full object-cover'
            />
            <div>
              <span className='font-medium block'>Mari Titvinidze</span>
              <select className='text-xs text-gray-500 border-none bg-gray-100 rounded p-1'>
                <option>Friends</option>
                <option>Public</option>
                <option>Only me</option>
              </select>
            </div>
          </div>
          
          <textarea 
            className='w-full h-32 p-4 text-lg border-none focus:outline-none resize-none' 
            placeholder="What's on your mind, Mari?"
          ></textarea>
          
          <div className='border border-gray-200 mx-4 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50'>
            <BsFillImageFill className='text-3xl text-gray-400 mb-2' />
            <p className='text-gray-600 mb-2'>Add photos/videos</p>
            <p className='text-gray-400 text-sm mb-3'>or drag and drop</p>
            <button className='bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium'>
              Add photos and videos from your mobile device.
            </button>
          </div>
          
          <div className='p-4'>
            <button className='bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md font-medium'>
              Post
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SecondPostSection;