import React, { useState } from 'react';
import { Search } from 'lucide-react';
import DefaultProfilePic from "../Images/DefaultProfilePic.png"
import Image from 'next/image';

const contacts = [
  "theo james",
  "Ryan gosling",
  "Morgan Freemer ",
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

  const filteredContacts = contacts.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" w-[290px] p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contacts</h2>
        <button onClick={() => setSearchActive(!searchActive)}>
          <Search size={18} />
        </button>
      </div>

      {searchActive && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mt-2 border rounded-md"
        />
      )}

      <ul className="mt-3">
        {filteredContacts.map((name, index) => (
          <li key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200">
            <Image src={DefaultProfilePic} alt='Profile' width={40} height={40} />
            <span className="text-gray-800">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThirdSection;
