"use client";
import React, { useState } from "react";
import Firstsection from "../__atoms/Firstsection";
import Secondsection from "../__atoms/Secondsection";
import PostSection from "../__atoms/PostSection";
import ThirdSection from "../__atoms/ThirdSection";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex gap-[185px] bg-gray-200 flex-grow p-4">
      <div className="flex mt-[76px] shadow-md flex-col gap-[10px] w-[300px] h-[88vh] overflow-y-scroll">
        <Firstsection />
        <div>
          <button
            onClick={handleToggle}
            className="flex items-center justify-center bg-gray-300 text-gray-700 w-[40px] h-[40px] rounded-[30px] hover:bg-gray-400 transition-colors"
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

export default Footer;