"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import { signInWithEmailAndPassword, UserCredential, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import SignUpPage from "./SignUp";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from "next/image";
import { useTheme } from "../../ThemeContext";

interface SavedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoggedOut(true);
      }
    });
    
    const saved = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    setSavedUsers(Array.isArray(saved) ? saved : []);
    
    return () => unsubscribe();
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (email && password) {
      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        const userDoc: DocumentSnapshot = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userToSave: SavedUser = {
            id: userCredential.user.uid,
            email: userCredential.user.email || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            photoURL: userData.photoURL || DefaultProfilePic
          };
          
          const existingUsers: SavedUser[] = JSON.parse(localStorage.getItem("savedUsers") || "[]");
          const exists: boolean = existingUsers.some((u: SavedUser) => u.id === userToSave.id);
          
          if (!exists) {
            const updatedUsers: SavedUser[] = [userToSave, ...existingUsers].slice(0, 5);
            localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
            setSavedUsers(updatedUsers);
          }
        }
        
        window.location.href = "/Insidepage"; 
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid credentials. Please try again.");
      }
    } else {
      alert("Please enter both email and password!");
    }
  };

  const handleQuickLogin = (user: SavedUser): void => {
    if (user && user.email) {
      setEmail(user.email);
    }
  };

  const handleSignUpPage = (): void => {
    setShowSignUp(true);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} h-screen flex items-center justify-center w-full`}>
      {!isLoggedIn ? (
        showSignUp ? (
          <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <SignUpPage />
          </div>
        ) : (
          <div className="flex w-[80%] max-w-[1000px] items-center justify-between">
            <div className="w-1/2 pr-10">
              <h1 className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-6xl font-bold`}>facebook</h1>
              {!isLoggedOut ? (
                <p className={`text-[20px] font-extrabold ${theme === 'dark' ? 'text-white' : 'text-black'} mt-4`}>
                  Connect with friends and the world <br /> around you on Facebook.
                </p>
              ) : (
                <div className="mt-8">
                  <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Recent Logins</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Click your picture or add an account.</p>
                  
                  <div className="grid mr-24 grid-cols-2 gap-2">
                    {savedUsers.map((user: SavedUser, index: number) => (
                      <div 
                        key={index}
                        onClick={() => handleQuickLogin(user)}
                        className={`flex flex-col items-center cursor-pointer hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg`}
                      >
                        <div className={`w-30 h-30 rounded-md overflow-hidden mb-2 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                          <Image 
                            src={user.photoURL} 
                            alt={`${user.firstName} ${user.lastName}`}
                            width={120}
                            height={120}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{user.firstName}</span>
                      </div>
                    ))}
                    <div className={`flex flex-col items-center cursor-pointer hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg`}>
                      <div className={`w-40 h-40 rounded-md border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="text-center p-4">
                          <Link href="/Signup">
                          <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mx-auto mb-2`}>
                            <span className={`text-3xl ${theme === 'dark' ? 'text-blue-300' : 'text-blue-500'}`}>+</span>
                          </div>
                          </Link>
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Add Account</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-8">
              <div className={`w-[400px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className={`w-full p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className={`w-full p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
                >
                  Log In
                </button>
                <p className={`text-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mt-2 cursor-pointer text-sm`}>
                  Forgot password?
                </p>
                <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
                <Link href="/Signup">
                  <button
                    onClick={handleSignUpPage}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
                  >
                    Create new account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Login;