"use client";
import React, { useState } from "react";
import Layout from "../__molecules/Layout";
import Profile from "../Images/DefaultProfilePic.png";
import Image from "next/image";
import { CameraIcon, PencilIcon } from "@heroicons/react/24/outline";
import SecondPostSection from "../__atoms/SecondPostSection";

const ProfilePage = () => {
  const [isHoveringCover, setIsHoveringCover] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full bg-white">

        <div className="flex flex-col items-center w-full bg-white">
          <div 
            className="w-[75%] h-[400px] bg-gray-300 relative rounded-lg cursor-pointer"
            onMouseEnter={() => setIsHoveringCover(true)}
            onMouseLeave={() => setIsHoveringCover(false)}
          >
            {isHoveringCover && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="flex items-center text-white">
                  <CameraIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Update cover photo</span>
                </div>
              </div>
            )}
          </div>
          <div className="w-[75%] max-w-6xl px-3 relative">
            <div className="flex items-end relative">
              <div className="absolute -top-16 left-0">
                <Image 
                  src={Profile} 
                  alt="User Profile" 
                  width={168} 
                  height={168}
                  className="rounded-full border-4 border-white shadow-md"
                />
              </div>
              
              <div className="ml-40 pt-4 flex-grow">
                <h1 className="text-3xl font-bold">Mari Titvinidze</h1>
                <p className="text-gray-600 mt-1">349 friends</p>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
                  + Add to story
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md font-medium">
                  Edit profile
                </button>
              </div>
            </div>
            <div className="border-t-2 border-gray-300 mt-11 pt-1">
              <div className="flex space-x-4">
                <button className="py-3 px-2 font-medium border-b-2 border-blue-500 text-blue-500">
                  Posts
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  About
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Friends
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Photos
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Videos
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  Reels
                </button>
                <button className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                  More ▼
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[75%] max-w-6xl flex gap-4 mt-4 pb-8">

          <div className="w-[35%] flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Intro</h2>
                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md p-2 text-left font-medium">
                  Add bio
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md p-2 text-left font-medium">
                  Edit details
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md p-2 text-left font-medium">
                  Add featured
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Photos</h2>
                <button className="text-blue-500 hover:underline">See all photos</button>
              </div>
       
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="aspect-square bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[65%] flex flex-col gap-4">
       
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src={Profile} 
                  alt="User Profile" 
                  width={40} 
                  height={40}
                  className="rounded-full"
                />
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  className="bg-gray-100 rounded-full px-4 py-2 flex-grow focus:outline-none"
                />
              </div>
              
              <div className="border-t pt-3 flex justify-between">
                 <SecondPostSection/>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Posts</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-200 rounded-md font-medium">
                    List view
                  </button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded-md">
                    Grid view
                  </button>
                </div>
              </div>
            
              <div className="mt-4 text-center py-8 text-gray-500">
                No posts to show
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;