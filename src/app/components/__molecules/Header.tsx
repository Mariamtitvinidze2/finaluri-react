'use client';
import { useState, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FB from "../Images/FB.png";
import Home from "../Images/Home.png";
import Video from "../Images/Video.png";
import Grouping from "../Images/Grouping.png";
import Gaming from "../Images/Gaming.png";
import Menu from "../Images/Menu.png";
import Messenger from "../Images/Messenger.png";
import Notifications from "../Images/Notifications.png";
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Firstesction from "../__atoms/Firstsection";
import PostSection from "../__atoms/PostSection";
import Secondsection from "../__atoms/Secondsection";
import ThirdSection from "../__atoms/ThirdSection";

const Header = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const storedFirstName = localStorage.getItem("firstName");
        const storedLastName = localStorage.getItem("lastName");
        if (storedFirstName && storedLastName) {
          setFirstName(storedFirstName);
          setLastName(storedLastName);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setFirstName(userData.firstName || "");
              setLastName(userData.lastName || "");
              localStorage.setItem("firstName", userData.firstName);
              localStorage.setItem("lastName", userData.lastName);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        setFirstName("");
        setLastName("");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full h-[70px] bg-white px-[20px] flex items-center justify-between fixed top-0 left-0 z-50 shadow-sm">
        <div className="flex items-center gap-[15px]">
          <Link href="/Insidepage">
            <Image src={FB} alt="Facebook Logo" width={40} height={40} className="cursor-pointer" />
          </Link>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="bg-[#e6ebed] border border-gray-300 rounded-full px-4 py-2 pl-10 w-[220px] focus:outline-none"
              placeholder="Search Facebook"
            />
          </div>
        </div>
        <div className="flex items-center gap-[60px]">
          <Image className="p-2 rounded-lg hover:bg-gray-100" src={Home} alt="Home Icon" width={70} height={70} />
          <Image className="p-2 rounded-lg hover:bg-gray-100" src={Video} alt="Video Icon" width={70} height={70} />
          <Image className="p-2 rounded-lg hover:bg-gray-100" src={Grouping} alt="Grouping Icon" width={70} height={70} />
          <Image className="p-2 rounded-lg hover:bg-gray-100" src={Gaming} alt="Gaming Icon" width={70} height={70} />
        </div>
        <div className="flex items-center gap-[20px]">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Image src={Menu} alt="Menu Icon" width={30} height={30} />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Image src={Messenger} alt="Messenger Icon" width={30} height={30} />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Image src={Notifications} alt="Notifications Icon" width={30} height={30} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200"
            >
              <Image 
                src={DefaultProfilePic} 
                alt="Profile" 
                width={30} 
                height={30} 
                className="rounded-full"
              />
              <span className="text-sm font-medium">{firstName}</span>
              <svg className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <Image 
                    src={DefaultProfilePic} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full mr-2"


                  />
                  <div>
                    <p className="font-medium">{firstName} {lastName}</p>
                    <p className="text-sm text-gray-500">See your profile</p>
                  </div>
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings & Privacy
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Help & Support
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <Link href="/">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                  Log Out
                </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex gap-[185px] bg-gray-200 bflex-grow p-4"> 
        <div className="flex mt-[76px] shadow-md flex-col gap-[10px] w-[300px] h-[88vh] overflow-y-scroll">
          
          <Firstesction />
          <div>
            <button onClick={handleToggle} className="bg-gray-300 text-white w-[40px] h-[40px] rounded-[30px]">
              ?
            </button>
            {isOpen && (
              <Secondsection />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-20px mt-[76px]">
            <PostSection/>
        </div>
        <div className="flex flex-col gap-4 mt-[76px]">
            <ThirdSection/>
        </div>
      </div>
    </div>
  );
};

export default Header;