import React from 'react';
import Image from 'next/image';
import Birthday from "../Images/Birthday.png";
import Climate from "../Images/Climate.png";
import Gamingvideo from "../Images/Gamingvideo.png";
import Messengerr from "../Images/Messengerr.png";
import Order from "../Images/Order.png";
import pages from "../Images/pages.png";
import playgames from "../Images/playgames.png";
import Recent from "../Images/Recent.png";
import Reels from "../Images/Reels.png";
import { useTheme } from "../../ThemeContext";

const Secondsection = () => {
  const { theme } = useTheme();

  return (
    <div className='space-y-2'>
      {[
        { icon: Birthday, text: 'Birthday' },
        { icon: Climate, text: 'Climate Science Center' },
        { icon: Gamingvideo, text: 'Gaming Video' },
        { icon: Messengerr, text: 'Messenger' },
        { icon: Order, text: 'Orders and payments' },
        { icon: pages, text: 'pages' },
        { icon: playgames, text: 'playgames' },
        { icon: Recent, text: 'Recent and activity' },
        { icon: Reels, text: 'Reels' }
      ].map((item, index) => (
        <div 
          key={index}
          className={`flex items-center gap-2 p-2 hover:${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg cursor-pointer`}
        >
          <Image src={item.icon} alt={item.text.toLowerCase()} width={30} height={30} />
          <h1 className={theme === 'dark' ? 'text-white' : 'text-slate-950'}>{item.text}</h1>
        </div>
      ))}
    </div>
  );
};

export default Secondsection;