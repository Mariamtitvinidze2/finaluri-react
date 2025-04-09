'use client';
import { useState, useEffect } from "react"; 
import { User } from "firebase/auth";
import { auth } from "../../../../firebaseConfig"; 

import { signOut } from "firebase/auth";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";
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

interface RecentLogin {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  photoURL: string;
}

const Secondheader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [messengerOpen, setMessengerOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      setUser(user);
      if (user) {
        localStorage.setItem('currentUserId', user.uid);
        
        const storedFirstName = localStorage.getItem("firstName");
        const storedLastName = localStorage.getItem("lastName");

        if (storedFirstName && storedLastName) {
          setFirstName(storedFirstName);
          setLastName(storedLastName);
        } else {
          try {
            const userDoc: DocumentSnapshot = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const firstNameValue = userData.firstName || "";
              const lastNameValue = userData.lastName || "";

              setFirstName(firstNameValue);
              setLastName(lastNameValue);

              localStorage.setItem("firstName", firstNameValue);
              localStorage.setItem("lastName", lastNameValue);

              const recentLogins: RecentLogin[] = JSON.parse(localStorage.getItem('recentLogins') || '[]');
              const userExists = recentLogins.some((u: RecentLogin) => u.id === user.uid);
              
              if (!userExists) {
                const newLogin: RecentLogin = {
                  id: user.uid,
                  email: user.email,
                  firstName: firstNameValue,
                  lastName: lastNameValue,
                  photoURL: user.photoURL || DefaultProfilePic.src
                };
                localStorage.setItem('recentLogins', JSON.stringify([newLogin, ...recentLogins].slice(0, 5)));
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        setFirstName("");
        setLastName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <header className="w-full h-[70px] bg-white px-[20px] flex items-center justify-between fixed top-0 left-0 z-50 shadow-sm">
      <div className="flex items-center gap-[15px]">
        <Link href="/Authinside">
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

      <div className="flex items-center gap-[20px] relative">
        <button 
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={() => setShowDropdown(false)}
        >
          <Image src={Menu} alt="Menu Icon" width={30} height={30} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setMessengerOpen(!messengerOpen)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Image src={Messenger} alt="Messenger Icon" width={30} height={30} />
          </button>
          
          {messengerOpen && (
            <div className="absolute right-0 mt-2 w-[300px] h-[500px] bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <div className="p-4">
                <h3 className="font-bold text-lg">Chats</h3>
              </div>
            </div>
          )}
        </div>

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
                href="/AuthProfile" 
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
              <Link href="/Loginpage">
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
  );
};

export default Secondheader;