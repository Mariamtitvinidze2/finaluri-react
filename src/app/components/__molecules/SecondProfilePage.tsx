"use client";
import React, { useState, ChangeEvent } from "react";
import Layout from "../__molecules/Layout";
import Profile from "../Images/DefaultProfilePic.png"; 
import Image, { StaticImageData } from "next/image";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid"; 
import { useTheme } from "../../ThemeContext";

import { auth, db } from "../../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import ThirdPostSection from "../__atoms/ThirdPostSection";

const SecondProfilePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOPen] = useState<boolean>(false);
  const [isHoveringCover, setIsHoveringCover] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null); 
  const [profilePhoto, setProfilePhoto] = useState<StaticImageData | string>(Profile);
  const savedName = localStorage.getItem("name") || "Mari";
  const savedSurname = localStorage.getItem("surname") || "Titvinidze";
  const [name, setName] = useState<string>(savedName);
  const [surname, setSurname] = useState<string>(savedSurname);
  const [editName, setEditName] = useState<string>(savedName);
  const [editSurname, setEditSurname] = useState<string>(savedSurname);
  const { theme } = useTheme();

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

  const handleProfilePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(",")[1]; 
  
      try {
        const API_KEY = "d899988b74bde90ba87e9dc804a0243e"; 
  
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", base64Image);
  
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (data.success) {
          const imageUrl = data.data.url;
          console.log("Uploaded to imgbb:", imageUrl);
          setProfilePhoto(imageUrl);
          localStorage.setItem("profilePhotoURL", imageUrl);
  
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              img: imageUrl,
            });
            console.log("User photo updated in Firestore");
          } else {
            console.error("User not authenticated");
          }
        } else {
          console.error("imgbb upload failed:", data);
        }
      } catch (error) {
        console.error("Error uploading to imgbb or updating Firestore:", error);
      }
    };
  
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setName(editName);
    setSurname(editSurname);
    localStorage.setItem("name", editName);
    localStorage.setItem("surname", editSurname); 
    setModalOpen(false);
  };

  return (
    <Layout userId="123">
      <div className={`flex flex-col items-center w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center w-full">
          <div 
            className={`w-[75%] h-[400px] relative rounded-lg cursor-pointer ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
            }`}
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
              <div className={`w-full h-full rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
              }`}></div>
            )}
          </div>

          <div className="w-[75%] max-w-6xl px-3 relative">
            <div className="flex items-end relative">
              <div className="absolute -top-24 left-0">
                <div className="relative w-[168px] h-[168px] rounded-full">
                  <Image 
                    src={profilePhoto} 
                    alt="User Profile" 
                    width={168} 
                    height={168} 
                    className="rounded-full object-cover w-full h-full"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              </div>
              <div className="ml-[180px] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {name} {surname}
                  </h1>
                  <PencilIcon
                    className={`w-5 h-5 cursor-pointer ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    onClick={() => setModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`p-6 rounded-lg w-[300px] ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Edit Profile</h2>
                  <XMarkIcon
                    className={`w-5 h-5 cursor-pointer ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    onClick={() => setModalOpen(false)}
                  />
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`border w-full p-2 rounded mb-2 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editSurname}
                  onChange={(e) => setEditSurname(e.target.value)}
                  className={`border w-full p-2 rounded mb-4 ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Surname"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          <div className="flex space-x-2 ml-[580px] mt-[-20px]">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
              + Add to story
            </button>
            <button className={`px-4 py-1.5 rounded-md font-medium ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              Edit profile
            </button>
          </div>
          <div className={`border-t-2 mt-4 pt-1 w-[1100px] relative ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <div className="flex space-x-4">
              <button className={`py-3 px-2 font-medium border-b-2 ${
                theme === 'dark' ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-500'
              }`}>
                Posts
              </button>
              <button className={`py-3 px-2 font-medium rounded-md ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                About
              </button>
              <button className={`py-3 px-2 font-medium rounded-md ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Friends
              </button>
              <button className={`py-3 px-2 font-medium rounded-md ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Photos
              </button>
              <button className={`py-3 px-2 font-medium rounded-md ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Videos
              </button>
              <button className={`py-3 px-2 font-medium rounded-md ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Reels
              </button>
              <button 
                onClick={() => setIsModalOPen(!isModalOpen)} 
                className={`py-3 px-2 font-medium rounded-md ${
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                More ▼
              </button>
            </div>
            {isModalOpen && (
              <div className={`absolute right-[390px] mt-2 w-[340px] h-[420px] shadow-lg rounded-lg border z-50 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 flex flex-col gap-2 scroll-auto">
                  {["Check-in", "Sports", "Music", "Movies", "Tv-shows", "Books", "Likes", "Events", "Reviews given", "Groups"].map((item) => (
                    <h3 key={item} className={`font-bold text-sm rounded-md h-8 p-2 ${
                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'
                    }`}>
                      {item}
                    </h3>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-[75%] max-w-6xl flex gap-4 mt-4 pb-8">
          <div className="w-[35%] flex flex-col gap-4">
            <div className={`rounded-lg shadow p-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Intro</h2>
                <button className={`p-1 rounded-full ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                }`}>
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <button className={`w-full rounded-md p-2 text-left font-medium ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  Add bio
                </button>
                <button className={`w-full rounded-md p-2 text-left font-medium ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  Edit details
                </button>
                <button className={`w-full rounded-md p-2 text-left font-medium ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  Add featured
                </button>
              </div>
            </div>
            <div className={`rounded-lg shadow p-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Photos</h2>
                <button className={`${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                } hover:underline`}>See all photos</button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className={`aspect-square rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
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