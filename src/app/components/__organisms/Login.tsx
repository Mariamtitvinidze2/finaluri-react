"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import Link from "next/link";
import SignUpPage from "./SignUp";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc, DocumentSnapshot } from "firebase/firestore";
import DefaultProfilePic from "../Images/DefaultProfilePic.png";
import Image from "next/image";

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
  const [selectedUser, setSelectedUser] = useState<SavedUser | null>(null);

  useEffect(() => {
    // Load saved users from localStorage
    const saved = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    setSavedUsers(Array.isArray(saved) ? saved : []);
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (email && password) {
      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        
        // Save user to recent logins if not already saved
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
            const updatedUsers: SavedUser[] = [userToSave, ...existingUsers].slice(0, 5); // Keep only last 5
            localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
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
      setSelectedUser(user);
      setEmail(user.email);
    }
  };

  const handleSignUpPage = (): void => {
    setShowSignUp(true);
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center w-full">
      {!isLoggedIn ? (
        showSignUp ? (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
            <SignUpPage />
          </div>
        ) : (
          <div className="flex w-[80%] max-w-[1000px] items-center justify-between">
            <div className="w-1/2 pr-10">
              <h1 className="text-blue-600 text-6xl font-bold">facebook</h1>
              <p className="text-[20px] font-extrabold text-black mt-4">
                Connect with friends and the world <br /> around you on Facebook.
              </p>
            </div>

            <div className="flex gap-8">
              {/* Recent Logins Section */}
              {savedUsers.length > 0 && (
                <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-4">Recent Logins</h2>
                  <p className="text-sm text-gray-500 mb-4">Click your picture or add an account.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {savedUsers.map((user: SavedUser, index: number) => (
                      <div 
                        key={index}
                        onClick={() => handleQuickLogin(user)}
                        className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-1">
                          <Image 
                            src={user.photoURL} 
                            alt={`${user.firstName} ${user.lastName}`}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{user.firstName}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-1">
                        <span className="text-2xl text-gray-400">+</span>
                      </div>
                      <span className="text-sm font-medium">Add Account</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full p-3 border text-slate-950 rounded-lg mb-3"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full p-3 border text-slate-950 rounded-lg mb-3"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
                >
                  Log In
                </button>
                <p className="text-center text-blue-500 mt-2 cursor-pointer text-sm">
                  Forgot password?
                </p>
                <hr className="my-4" />
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