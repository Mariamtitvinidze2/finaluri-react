
'use client';
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, orderBy, startAt, endAt, getDocs, limit } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FB from "../Images/FB.png";
import Home from "../Images/Home.png";
import Video from "../Images/Video.png";
import Grouping from "../Images/Grouping.png";
import Gaming from "../Images/Gaming.png";
import Menu from "../Images/Menu.png";
import Messenger from "../Images/Messenger.png";
import Notifications from "../Images/Notifications.png";
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import { useTheme } from "../../ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

interface SearchUser {
  id: string;
  name: string;
  username: string;
  image?: string;
}

const Header = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchQuery(decodeURIComponent(queryParam));
      setDebouncedQuery(decodeURIComponent(queryParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      const encoded = encodeURIComponent(searchQuery);
      router.push(`?query=${encoded}`, { scroll: false });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userDoc, profileDoc] = await Promise.all([
          getDoc(doc(db, "users", userId)),
          getDoc(doc(db, "profiles", userId))
        ]);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
        }

        if (profileDoc.exists()) {
          setProfilePhoto(profileDoc.data().photoURL || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          orderBy("name_lowercase"), 
          startAt(debouncedQuery.toLowerCase()),
          endAt(debouncedQuery.toLowerCase() + "\uf8ff"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SearchUser[];

        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchFocused(false);
  };

  if (!user) {
    return <div className="h-[70px] bg-white dark:bg-gray-900"></div>;
  }

  return (
    <header className={`w-full h-[70px] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} px-[20px] flex items-center justify-between fixed top-0 left-0 z-50 shadow-sm`}>
      <div className="flex items-center gap-[15px]">
        <Link href="/Insidepage">
          <Image 
            src={FB} 
            alt="Facebook Logo" 
            width={40} 
            height={40} 
            className="cursor-pointer" 
            priority
          />
        </Link>
        <div className="relative">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className={`${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-600' : 'bg-[#e6ebed] border-gray-300 focus:ring-blue-500'} border rounded-full px-4 py-2 pl-10 w-[220px] focus:outline-none focus:ring-2`}
            placeholder="Search Facebook"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => {
              setSearchFocused(true);
              setShowSearchResults(true);
            }}
            onBlur={() => setTimeout(() => {
              if (!searchQuery) setShowSearchResults(false);
            }, 200)}
          />
          {(showSearchResults && searchFocused) && (
            <div className={`absolute top-full left-0 mt-2 w-[300px] rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {isSearching ? (
                <div className="p-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium px-2 py-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>People</p>
                  </div>
                  {searchResults.map((user) => (
                    <div 
                      key={user.id}
                      className={`flex items-center p-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} cursor-pointer`}
                      onClick={() => handleUserClick(user.id)}
                    >
                      <Image 
                        src={user.image || DefaultProfilePic.src} 
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{user.name}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.username}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : searchQuery.trim() ? (
                <div className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No results found for {searchQuery}
                </div>
              ) : (
                <div className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start typing to search for people
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-[60px]">
        <Link href="/Insidepage" className={`p-2 rounded-lg hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} group`}>
          <Image src={Home} alt="Home Icon" width={40} height={40} className="group-hover:opacity-80" />
        </Link>
        <Link href="/videos" className={`p-2 rounded-lg hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} group`}>
          <Image src={Video} alt="Video Icon" width={40} height={40} className="group-hover:opacity-80" />
        </Link>
        <Link href="/groups" className={`p-2 rounded-lg hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} group`}>
          <Image src={Grouping} alt="Grouping Icon" width={40} height={40} className="group-hover:opacity-80" />
        </Link>
        <Link href="/gaming" className={`p-2 rounded-lg hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} group`}>
          <Image src={Gaming} alt="Gaming Icon" width={40} height={40} className="group-hover:opacity-80" />
        </Link>
      </div>
      <div className="flex items-center gap-[20px]">
        <button 
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          onClick={() => setShowDropdown(false)}
        >
          <Image src={Menu} alt="Menu Icon" width={24} height={24} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setMessengerOpen(!messengerOpen)}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors relative`}
          >
            <Image src={Messenger} alt="Messenger Icon" width={24} height={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {messengerOpen && (
            <div className={`absolute right-0 mt-2 w-[300px] h-[500px] ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg rounded-lg border flex flex-col`}>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Chats</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
                  Your messages will appear here
                </div>
              </div>
            </div>
          )}
        </div>
        <button className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors relative`}>
          <Image src={Notifications} alt="Notifications Icon" width={24} height={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            5
          </span>
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 p-1 rounded-full hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} transition-colors`}
          >
            <Image 
              src={profilePhoto || DefaultProfilePic.src} 
              alt="Profile" 
              width={32} 
              height={32} 
              className="rounded-full object-cover"
            />
            <span className={`text-sm font-medium hidden md:inline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{firstName}</span>
            <svg className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className={`absolute right-0 mt-2 w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg z-50 border divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <Link 
                href="/Profile" 
                className={`flex items-center px-4 py-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                onClick={() => setShowDropdown(false)}
              >
                <Image 
                  src={profilePhoto || DefaultProfilePic.src} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className="rounded-full mr-3 object-cover"
                />
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{firstName} {lastName}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>See your profile</p>
                </div>
              </Link>
              
              <div className="py-1">
                <button 
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                >
                  <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Switch Theme</span>
                  {theme === 'light' ? (
                    <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-yellow-500" />
                  )}
                </button>
                <button className={`w-full text-left px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Settings & Privacy
                </button>
                <button className={`w-full text-left px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Help & Support
                </button>
              </div>
              
              <div className="py-1">
                <button 
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-red-500 transition-colors`}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;