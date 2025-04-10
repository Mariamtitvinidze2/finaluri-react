import Image from 'next/image';
import DefaultProfilePic from '../Images/DefaultProfilePic.png';
import Friends from '../Images/Friends.png';
import Memories from "../Images/Memories.png";
import Saved from "../Images/Saved.png";
import Gorups from "../Images/Groups.png";
import Videos from "../Images/Videos.png";
import Feeds from "../Images/Feeds.png";
import Events from "../Images/Events.png";
import AdsManeger from "../Images/AdsManeger.png";
import Fundraisers from "../Images/Fundraisers.png";
import Link from 'next/link';
import { useTheme } from "../../ThemeContext";

const Firstsection = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-3 p-2 hover:${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg cursor-pointer`}>
        <Link href="/Profile">
        <Image 
          src={DefaultProfilePic} 
          alt="User Profile" 
          width={50} 
          height={50}
          className="rounded-full"
        />
        </Link>
        <h1 className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mari Titvinidze</h1>
      </div>
      
      {[
        { icon: Friends, text: 'Friends' },
        { icon: Memories, text: 'Memories' },
        { icon: Saved, text: 'Saved' },
        { icon: Gorups, text: 'Groups' },
        { icon: Videos, text: 'Video' },
        { icon: Feeds, text: 'Feeds' },
        { icon: Events, text: 'Events' },
        { icon: AdsManeger, text: 'Ads Manager' },
        { icon: Fundraisers, text: 'Fundraisers' }
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

export default Firstsection;