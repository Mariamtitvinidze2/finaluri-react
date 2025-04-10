import React, { useState } from 'react';
import { Search } from 'lucide-react';
import DefaultProfile from "../Images/DefaultProfile.png";
import Image from 'next/image';
import { useTheme } from "../../ThemeContext";

const contacts = [
  "theo james",
  "Ryan gosling",
  "Morgan Freemer",
  "Mark Wahlberg",
  "Jake Gyllenhaal",
  "J.K. Simmons",
  "dwayne johnson",
  "Cillian Murphy",
  "Robin Williams",
  "Paul walker",
  "Adriano Chelentano"
];

const ThirdSection = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const filteredContacts = contacts.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-[290px] p-4 rounded-lg shadow-2xl border-gray-600 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Contacts</h2>
        <button onClick={() => setSearchActive(!searchActive)} className={theme === 'dark' ? 'text-white' : 'text-black'}>
          <Search size={18} />
        </button>
      </div>

      {searchActive && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 mt-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
        />
      )}

      <ul className="mt-3">
        {filteredContacts.map((name, index) => (
          <li 
            key={index} 
            className={`flex items-center space-x-3 p-2 rounded-md hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Image src={DefaultProfile} alt='Profile' width={40} height={40} className="rounded-full" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThirdSection;