import React, { useEffect, useState } from 'react';
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

const Firstsection = () => {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {              
 
    const firstName = localStorage.getItem("firstName") || '';
    const lastName = localStorage.getItem("lastName") || '';
    setUserName(`${firstName} ${lastName}`);
  }, []);

  return (
    <div className="space-y-2">
      
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
        <Link href="/Profile">
        <Image 
          src={DefaultProfilePic} 
          alt="User Profile" 
          width={50} 
          height={50}
          className="rounded-full"
        />
        </Link>
        <h1 className="font-semibold text-slate-950">{userName}</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Friends} alt="friends" width={30} height={30} />
        <h1 className='text-slate-950'>Friends</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Memories} alt="memories" width={30} height={30} />
        <h1 className='text-slate-950'>Memories</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Saved} alt="saved" width={30} height={30} />
        <h1 className='text-slate-950'>Saved</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Gorups} alt="groups" width={30} height={30} />
        <h1 className='text-slate-950'>Groups</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Videos} alt="videos" width={30} height={30} />
        <h1 className='text-slate-950'>Video</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Feeds} alt="feeds" width={30} height={30} />
        <h1 className='text-slate-950'>Feeds</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Events} alt="events" width={30} height={30} />
        <h1 className='text-slate-950'>Events</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={AdsManeger} alt="ads manager" width={30} height={30} />
        <h1 className='text-slate-950'>Ads Manager</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Fundraisers} alt="fundraisers" width={30} height={30} />
        <h1 className='text-slate-950'>Fundraisers</h1>
      </div>
    </div>
  );
};

export default Firstsection;