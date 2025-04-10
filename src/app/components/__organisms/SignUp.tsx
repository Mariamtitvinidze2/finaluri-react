'use client';
import { useState, ChangeEvent } from "react";
import { auth } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Header from "../__molecules/Header";
import Link from "next/link";
import translations from "../../../data.json"; 
import { Translations, Translation } from "../../translations";
import { FirebaseError } from "firebase/app"; 
import { useTheme } from "../../ThemeContext";

interface Dob {
  month: string;
  day: string;
  year: string;
}

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [dob, setDob] = useState<Dob>({ month: "Jan", day: "1", year: "2000" });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); 
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false); 
  const [language, setLanguage] = useState<string>("en");
  const { theme } = useTheme();

  const translationData = translations as Translations;
  const t: Translation = translationData[language];

  const handleSignUp = async (): Promise<void> => {
    if (email && password && name && surname && dob) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsSignedUp(true);
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          if (error.code === "auth/email-already-in-use") {
            setError("This email is already in use. Please choose another one.");
          } else {
            setError("An error occurred. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleDobChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setDob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log("Selected gender:", e.target.value);
  };

  return (
    <div className={`h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="min-h-screen flex flex-col">
        <h2 className={`text-5xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-center mt-4`}>{t.main}</h2>
        <div className={`flex-grow flex justify-center items-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          {isSignedUp ? (
            <div className="w-full">
              <header className="fixed top-0 left-0 w-full z-50">
                <Header userId="123"/> 
              </header>
              <div className="pt-[80px]"></div>
            </div>
          ) : (
            <div className={`w-[450px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5 rounded-lg shadow-lg my-8`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'} text-center mb-2`}>{t.title}</h2>
              <h2 className={`text-1xl text-center ${theme === 'dark' ? 'text-gray-300' : 'text-slate-950'} mb-2`}>{t.subtitle}</h2>
              <div className="flex gap-[10px]">
                <input
                  type="text"
                  placeholder={t.firstName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-[200px] h-[40px] p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
                />
                <input
                  type="text"
                  placeholder={t.lastName}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className={`w-[200px] h-[40px] p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <h2 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>{t.birthday}</h2>
                <div className="flex gap-[20px] mb-2">
                  <select
                    name="month"
                    className={`mb-2 w-[160px] p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={dob.month}
                    onChange={handleDobChange}
                  >
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="day"
                    className={`mb-2 w-[130px] p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={dob.day}
                    onChange={handleDobChange}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                    ))}
                  </select>
                  <select
                    name="year"
                    className={`mb-2 w-[130px] p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={dob.year}
                    onChange={handleDobChange}
                  >
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i} value={(2025 - i).toString()}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-[5px]">
                <h2 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-950'}`}>{t.gender}</h2>
                <div className="flex gap-[30px] mb-2">
                  <label className={`mb-2 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-950'} border-2 border-solid w-[125px] h-[30px] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <input type="radio" name="gender" value="Female" onChange={handleChange} /> {t.genders}
                  </label>
                  <label className={`mb-2 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-950'} border-2 border-solid w-[125px] h-[30px] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <input type="radio" name="gender" value="Male" onChange={handleChange} /> {t.mamrobiti}
                  </label>
                  <label className={`mb-2 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-950'} border-2 border-solid w-[125px] h-[30px] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <input type="radio" name="gender" value="Custom" onChange={handleChange} /> {t.custom}
                  </label>
                </div>
              </div>
              <input
                type="text"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-[40px] p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
              />
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 h-[40px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-slate-950'} rounded-lg mb-3`}
              />
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-tight`}>
                {t.text}{" "}
                <a href="#" className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Learn more</a>.
              </p>
              <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-tight`}>
                {t.terms}{" "}
                {t.termsLinks.map((link, index) => (
                  <a key={index} href="#" className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>{link}</a>
                ))}
              </p>
              <div className="flex justify-center mt-5">
                <Link href="/Authinside">
                  <button
                    onClick={handleSignUp}
                    className="bg-green-600 text-white py-2 rounded-lg font-bold w-[240px]"
                  >
                    {t.signUp}
                  </button>
                </Link>
              </div>
              <p className={`text-s mt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-center`}>{t.alreadyHave}</p>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
          )}
        </div>
        {!isSignedUp && (
          <div className={`w-full h-[300px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-10`}>
            <div className="whitespace-nowrap p-4 text-center">
              {["en", "ka", "ru", "it", "de", "es", "fr", "zh", "tr"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 mx-1 rounded ${language === lang ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white') : (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-black')}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} my-4`}></div>
            <div className="flex flex-wrap gap-4 mb-4">
              {["Sign Up", "Login", "Messenger", "Facebook Live", "Video", "Meta Pay", "Meta Store", "Meta Quest", "Ray-Ban Meta", "Meta AI", "Instagram", "Threads", "Voting Information Center", "Privacy Policy", "Privacy Center", "About", "Create ad", "Create Page", "Developers", "Careers", "Cookies", "Ad choices!", "Terms", "Help", "Contact Uploading & Non-Likes"].map((item, index) => (
                <span key={index} className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>{item}</span>
              ))}
            </div>
            <div className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Meta © 2025
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;