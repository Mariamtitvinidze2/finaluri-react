"use client";
import { useState } from "react";
import { auth } from "../../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import Header from "../__molecules/Header/Header";
import SignUpPage from "./SignUpPage";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false); 

  const handleLogin = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password); 
        setIsLoggedIn(true);
      } catch (error) {
        alert("Invalid credentials. Please try again.");
      }
    } else {
      alert("Please enter both email and password!");
    }
  };

  const handleSignUpPage = () => {
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
              <p className="text-[20px] font-extrabold text-black-500 mt-4">
                Connect with friends and the world <br /> around you on Facebook.
              </p>
            </div>

       
            <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg mb-3"
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
              <button
                onClick={handleSignUpPage} 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
              >
                Create new account
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center">
          <Header />
          <h2 className="text-2xl font-bold mt-6">Welcome to your profile!</h2>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
