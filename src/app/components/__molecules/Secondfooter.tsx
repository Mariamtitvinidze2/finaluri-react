
"use client";
import React, { useState } from "react";
import Firstsection from "../__atoms/Firstsection";
import Secondsection from "../__atoms/Secondsection";
import PostSection from "../__atoms/PostSection";
import ThirdSection from "../__atoms/ThirdSection";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "../../ThemeContext";

const Secondfooter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex gap-[185px] ${theme === 'dark' ? 'bg-gray-9500' : 'bg-gray-200'} flex-grow p-4`}>
      <div className={`flex mt-[76px] shadow-md flex-col p-2 gap-[10px] w-[300px] h-[88vh] overflow-y-scroll ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <Firstsection />
        <div>
          <button
            onClick={handleToggle}
            className={`flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-300 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} w-[40px] h-[40px] rounded-[30px] transition-colors`}
          >
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isOpen && <Secondsection />}
        </div>
      </div>
      <div className="flex flex-col gap-20px mt-[76px]">
        <PostSection />
      </div>
      <div className="flex flex-col gap-4 mt-[76px]">
        <ThirdSection />
      </div>
    </div>
  );
};

export default Secondfooter;