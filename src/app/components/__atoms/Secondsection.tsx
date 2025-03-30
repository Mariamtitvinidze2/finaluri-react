import React from 'react';
import Image from 'next/image';
import Birthday from "../Images/Birthday.png";
import Climate from "../Images/Climate.png"
import Gamingvideo from "../Images/Gamingvideo.png"
import Messengerr from "../Images/Messengerr.png"
import Order from "../Images/Order.png"
import pages from "../Images/pages.png"
import playgames from "../Images/playgames.png"
import Recent from "../Images/Recent.png"
import Reels from "../Images/Reels.png"
const Secondsection = () => {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Birthday} alt="Birthday" width={30} height={30} />
        <h1 className='text-slate-950'>Birthday</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Climate} alt="Climate" width={30} height={30} />
        <h1 className='text-slate-950'>Climate Science Center</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Gamingvideo} alt="Gamingvideo" width={30} height={30} />
        <h1 className='text-slate-950'>Gaming Video</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Messengerr} alt="Messengerr" width={30} height={30} />
        <h1 className='text-slate-950'>Messenger</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Order} alt="Order" width={30} height={30} />
        <h1 className='text-slate-950'>Orders and payments</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointe'> 
        <Image src={pages} alt="pages" width={30} height={30} />
        <h1 className='text-slate-950'>pages</h1>
      </div>

      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={playgames} alt="playgames" width={30} height={30} />
        <h1 className='text-slate-950'>playgames</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Recent} alt="Recent" width={30} height={30} />
        <h1 className='text-slate-950'>Recent and activity</h1>
      </div>
      <div className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'> 
        <Image src={Reels} alt="Reels" width={30} height={30} />
        <h1 className='text-slate-950'>Reels</h1>
      </div>
    </div>
  );
};
export default Secondsection;