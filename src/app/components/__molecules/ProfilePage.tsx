"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Layout from "../__molecules/Layout";
import Profile from "../Images/DefaultProfilePic.png"; 
import Image, { StaticImageData } from "next/image";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid"; 
import SecondPostSection from "../__atoms/SecondPostSection";
import { auth, db } from "../../../../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";

const ProfilePage: React.FC = () => {
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

  useEffect(() => {
    const loadUserData = async () => {
      const savedCoverPhoto = localStorage.getItem("coverPhotoURL");
      const savedProfilePhoto = localStorage.getItem("profilePhotoURL");
      
      if (savedCoverPhoto) setCoverPhoto(savedCoverPhoto);
      if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.coverPhotoURL) {
            setCoverPhoto(userData.coverPhotoURL);
            localStorage.setItem("coverPhotoURL", userData.coverPhotoURL);
          }
          if (userData.img) {
            setProfilePhoto(userData.img);
            localStorage.setItem("profilePhotoURL", userData.img);
          }
          if (userData.firstName) {
            setName(userData.firstName);
            setEditName(userData.firstName);
            localStorage.setItem("name", userData.firstName);
          }
          
          if (userData.lastName) {
            setSurname(userData.lastName);
            setEditSurname(userData.lastName);
            localStorage.setItem("surname", userData.lastName);
          }
        }
      }
    };

    loadUserData();
  }, []);

  const handleCoverPhotoChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
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
            setCoverPhoto(imageUrl);
            localStorage.setItem("coverPhotoURL", imageUrl);

            const user = auth.currentUser;
            if (user) {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                coverPhotoURL: imageUrl,
              });
            }
          }
        } catch (error) {
          console.error("Error uploading cover photo:", error);
        }
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
          setProfilePhoto(imageUrl);
          localStorage.setItem("profilePhotoURL", imageUrl);
  
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              img: imageUrl,
            });
          }
        }
      } catch (error) {
        console.error("Error uploading to imgbb or updating Firestore:", error);
      }
    };
  
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setName(editName);
    setSurname(editSurname);
    localStorage.setItem("name", editName);
    localStorage.setItem("surname", editSurname); 
    
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: editName,
        lastName: editSurname,
      });
    }
    
    setModalOpen(false);
  };

  return (
    <Layout userId="123">
      <div className={`flex flex-col items-center w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center w-full">
          <div 
            className={`w-[75%] h-[400px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} relative rounded-lg cursor-pointer`}
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
              <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} rounded-lg`}></div>
            )}
          </div>

          <div className="w-[75%] max-w-6xl px-3 relative">
            <div className="flex items-end relative">
              <div className="absolute -top-24 left-0">
                <div className="relative w-[168px] h-[168px] rounded-full">
                  <Image 
                    src={profilePhoto} 
                    alt="User Profile" 
                    width={148} 
                    height={148} 
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
                  <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {name} {surname}
                  </h1>
                  <PencilIcon
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} cursor-pointer`}
                    onClick={() => setModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`p-6 rounded-lg w-[300px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Edit Profile</h2>
                  <XMarkIcon
                    className={`w-5 h-5 cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onClick={() => setModalOpen(false)}
                  />
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`border w-full p-2 rounded mb-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editSurname}
                  onChange={(e) => setEditSurname(e.target.value)}
                  className={`border w-full p-2 rounded mb-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
          <div className="flex space-x-2 ml-[580px] mt-[-20px]">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md font-medium">
              + Add to story
            </button>
            <button className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-1.5 rounded-md font-medium`}>
              Edit profile
            </button>
          </div>
          <div className={`border-t-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} mt-4 pt-1 w-[1100px] relative`}>
            <div className="flex space-x-4">
              <button className={`py-3 px-2 font-medium border-b-2 border-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                Posts
              </button>
              <button className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                About
              </button>
              <button className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                Friends
              </button>
              <button className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                Photos
              </button>
              <button className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                Videos
              </button>
              <button className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}>
                Reels
              </button>
              <button 
                onClick={() => setIsModalOPen(!isModalOpen)} 
                className={`py-3 px-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-md`}
              >
                More ▼
              </button>
            </div>
            {isModalOpen && (
              <div className={`absolute right-[390px] mt-2 w-[340px] h-[420px] ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg rounded-lg border z-50`}>
                <div className="p-4 flex flex-col gap-2 scroll-auto">
                  {["Check-in", "Sports", "Music", "Movies", "Tv-shows", "Books", "Likes", "Events", "Reviews given", "Groups"].map((item) => (
                    <h3 
                      key={item}
                      className={`font-serif text-sm font-bold ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'} rounded-md h-8 p-2`}
                    >
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
            <div className={`rounded-lg shadow p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Intro</h2>
                <button className={`${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} p-1 rounded-full`}>
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <button className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-md p-2 text-left font-medium`}>
                  Add bio
                </button>
                <button className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-md p-2 text-left font-medium`}>
                  Edit details
                </button>
                <button className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-md p-2 text-left font-medium`}>
                  Add featured
                </button>
              </div>
            </div>
            <div className={`rounded-lg shadow p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Photos</h2>
                <button className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} hover:underline`}>See all photos</button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div 
                    key={item} 
                    className={`aspect-square rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <SecondPostSection />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;