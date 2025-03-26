import { useState, useEffect } from "react";
import { auth } from "../../../../../firebaseConfig";
import { signOut } from "firebase/auth";
import Image from "next/image";
import FB from "../../Images/FB.png";
import Home from "../../Images/Home.png";
import Video from "../../Images/Video.png";
import Grouping from "../../Images/Grouping.png";
import Gaming from "../../Images/Gaming.png";
import Menu from "../../Images/Menu.png";
import Messenger from "../../Images/Messenger.png";
import Notifications from "../../Images/Notifications.png";
import DefaultProfilePic from "../../Images/DefaultProfilePic.png";
import FirsSection from "../../__atoms/FirsSection";

const Header = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };
  useEffect(() => {
   
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    
    if (storedFirstName && storedLastName) {
      setFirstName(storedFirstName);
      setLastName(storedLastName);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


  return (
    <div className="flex flex-col gap-[15px]" >
      <header className="w-full h-[70px] bg-[#ffffff] px-[20px] flex items-center justify-between">
      <div className="flex items-center gap-[15px]">
        <Image src={FB} alt="Facebook Logo" width={40} height={40} />
        <input
          type="text"
          className="bg-[#e6ebed] border border-gray-300 rounded-full px-4 py-2 w-[220px] focus:outline-none"
          placeholder="Search Facebook"
        />
      </div>

      <div className="flex items-center gap-[60px]">
        <Image src={Home} alt="Home Icon" width={55} height={55} />
        <Image src={Video} alt="Video Icon" width={55} height={55} />
        <Image src={Grouping} alt="Grouping Icon" width={55} height={55} />
        <Image src={Gaming} alt="Gaming Icon" width={55} height={55} />
      </div>
      <div className="flex items-center gap-[20px]">
        <Image src={Menu} alt="Menu Icon" width={55} height={55} />
        <Image src={Messenger} alt="Messenger Icon" width={55} height={55} />
        <Image src={Notifications} alt="Notifications Icon" width={55} height={55} />
      </div>
      </header>
     <div className="flex gap-[20px]">
      <div className="flex flex-col gap-[10px] ml-[10px]">
      <Image
          src={DefaultProfilePic}
          alt="Profile Picture"
          width={60}
          height={60}
          className="rounded-full "
        />
        <FirsSection/>
        </div>
        </div>
    </div>
    
  );
};

export default Header;

































     











