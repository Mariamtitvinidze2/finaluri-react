import React from 'react'
import Image from 'next/image'
import Friends from '../Images/Friends.png'
import Memories from "../Images/Memories.png"
import Saved from "../Images/Saved.png"
import Gorups from "../Images/Groups.png"
import Videos from "../Images/Videos.png"
import Feeds from "../Images/Feeds.png"
import Events from "../Images/Events.png"
import AdsManeger from "../Images/AdsManeger.png"

const FirsSection = () => {
  return (
    <div>
        <div className='flex items-center gap-2'> 
            <Image src={Friends} alt="friends" width={55} height={55} />
            <h1>Friends</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Memories} alt="friends" width={55} height={55} />
            <h1>Memoires</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Saved} alt="friends" width={50} height={50} />
            <h1>Saved</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Gorups} alt="friends" width={55} height={55} />
            <h1>Gorups</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Videos} alt="friends" width={55} height={55} />
            <h1>Video</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Feeds} alt="friends" width={55} height={55} />
            <h1>Feeds</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={Events} alt="friends" width={55} height={55} />
            <h1>Events</h1>
        </div>
        <div className='flex items-center gap-2'> 
            <Image src={AdsManeger} alt="friends" width={55} height={55} />
            <h1>Ads Maneger</h1>
        </div>
    </div>
  )
}

export default FirsSection
