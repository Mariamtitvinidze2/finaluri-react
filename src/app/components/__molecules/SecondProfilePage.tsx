"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Layout from "../__molecules/Layout";
import Profile from "../Images/DefaultProfilePic.png"; 
import Image, { StaticImageData } from "next/image";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid"; 

import ThirdPostSection from "../../components/__atoms/ThirdPostSection";

const SecondProfilePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOPen] = useState<boolean>(false);
  const [isHoveringCover, setIsHoveringCover] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null); 
  const [profilePhoto, setProfilePhoto] = useState<StaticImageData | any>(Profile);
  const savedName = localStorage.getItem("name") || "Mari";
  const savedSurname = localStorage.getItem("surname") || "Titvinidze";
  
  const [name, setName] = useState<string>(savedName);
  const [surname, setSurname] = useState<string>(savedSurname);
  const [editName, setEditName] = useState<string>(savedName);
  const [editSurname, setEditSurname] = useState<string>(savedSurname);

  const handleCoverPhotoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto({
          src: reader.result as string,
          height: 168,
          width: 168,
          blurDataURL: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setName(editName);
    setSurname(editSurname);
    localStorage.setItem("name", editName); 
    localStorage.setItem("surname", editSurname); 
    setModalOpen(false);
  };

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
                <span className="text-white font-medium">Update cover photo</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleCoverPhotoChange}
            />
            {coverPhoto ? (
              <Image 
                src={coverPhoto} 
                alt="Cover" 
                width={500} 
                height={300} 
                className="w-full h-full object-cover rounded-lg" 
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-lg"></div>
            )}
          </div>

          <div className="w-[75%] max-w-6xl px-3 relative">
            <div className="flex items-end relative">
              <div className="absolute -top-24 left-0">
                <div className="relative w-[168px] h-[168px]">
                  <Image 
                    src={profilePhoto} 
                    alt="User Profile" 
                    width={188} 
                    height={188} 
                    
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              </div>
              <div className="ml-[180px] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    {name} {surname}
                  </h1>
                  <PencilIcon
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={() => setModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Edit Profile</h2>
                  <XMarkIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => setModalOpen(false)}
                  />
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border w-full p-2 rounded mb-2"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editSurname}
                  onChange={(e) => setEditSurname(e.target.value)}
                  className="border w-full p-2 rounded mb-4"
                  placeholder="Surname"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white w-full py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          <div className="flex space-x-2 ml-[580px] mt-[-20px] ">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
              + Add to story
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md font-medium">
              Edit profile
            </button>
          </div>
          <div className="border-t-2 border-gray-300 mt-4 pt-1 w-[1100px] relative">
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
              <button onClick={() => setIsModalOPen(!isModalOpen)} className="py-3 px-2 font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                More ▼
              </button>
            </div>
            {isModalOpen && (
              <div className="absolute right-[390px] mt-2 w-[340px] h-[420px] bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="p-4 flex flex-col gap-2 scroll-auto">
                  <h3 className="font-serif text-sm font-bold hover:bg-gray-100 rounded-md h-8 p-2">Check-in</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Sports</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Music</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Movies</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Tv-shows</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Books</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Likes</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Events</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Reviews given</h3>
                  <h3 className="font-serif font-bold text-sm hover:bg-gray-100 rounded-md h-8 p-2">Groups</h3>
                </div>
              </div>
            )}
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
          <ThirdPostSection />
        </div>
      </div>
    </Layout>
  );
};

export default SecondProfilePage;
