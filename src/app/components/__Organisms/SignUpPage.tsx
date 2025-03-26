'use client';
import { useState, ChangeEvent } from "react";
import { auth } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Header from "../__molecules/Header/Header";
interface Dob {
  month: string;
  day: string;
  year: string;
}
interface Translations {
  [key: string]: {
    text: string;
    ianvari: string;
    custom: string;
    mamrobiti: string;
    genders: string;
    main: string;
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    email: string;
    password: string;
    signUp: string;
    alreadyHave: string;
    terms: string;
    termsLinks: string[];
  };
}
const SignUpPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [dob, setDob] = useState<Dob>({ month: "Jan", day: "1", year: "2000" });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); 
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false); 
  const [language, setLanguage] = useState<string>("en");
  const handleSignUp = async (): Promise<void> => {
    if (email && password && name && surname && dob) {
      try {
        await createUserWithEmailAndPassword(auth, email, password); 
        setIsSignedUp(true); 
      } catch (error: any) {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        if (error.code === "auth/email-already-in-use") {
          setError("This email is already in use. Please choose another one.");
        } else {
          setError("An error occurred. Please try again later.");
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
  const translations: Translations = {
    en: {
        text: "People who use our service may have uploaded your contact information to Facebook.",
      ianvari: "January",
      custom: "Other",
      mamrobiti: "Male",
      genders: "Female",
      main: "Facebook",
      title: "Create a new account",
      subtitle: "It’s quick and easy.",
      firstName: "First Name",
      lastName: "Last Name",
      birthday: "Birthday",
      gender: "Gender",
      email: "Email",
      password: "Password",
      signUp: "Sign Up",
      alreadyHave: "Already have an account?",
      terms: "By clicking Sign Up, you agree to our ",
      termsLinks: ["Terms", "Privacy Policy", "Cookies Policy"],
    },
    ka: {
      text: "ადამიანები, რომლებიც ჩვენს სერვისს იყენებენ, შესაძლოა თქვენს საკონტაქტო ინფორმაციას Facebook-ზე ატვირთავდნენ.",
      ianvari: "იანვარი",
      custom: "სხვა",
      mamrobiti: "მამრობითი",
      genders: "მდედრობითი",
      main: "ფეისბუქი",
      title: "შექმნიტ ახალი ანგარიში",
      subtitle: "ეს სწრაფი და მარტივია.",
      firstName: "სახელი",
      lastName: "გვარი",
      birthday: "დაბადების თარიღი",
      gender: "სქესი",
      email: "ელ.ფოსტა",
      password: "პაროლი",
      signUp: "რეგისტრაცია",
      alreadyHave: "უკვე გაქვთ ანგარიში?",
      terms: "რეგისტრაციისას თქვენ ეთანხმებით ჩვენს ",
      termsLinks: ["წესებს", "კონფიდენციალურობის პოლიტიკას", "ქუქი პოლიტიკას"],
    },
    ru: {
        text: " Люди, которые используют наш сервис, могли загрузить вашу контактную информацию на Facebook.",
      ianvari: "Январь",
      custom: "Иной",
      mamrobiti: "мужской",
      genders: "женский",
      main: "Фейсбук",
      title: "Создайте новый аккаунт",
      subtitle: "Это быстро и легко.",
      firstName: "Имя",
      lastName: "Фамилия",
      birthday: "Дата рождения",
      gender: "Пол",
      email: "Электронная почта",
      password: "Пароль",
      signUp: "Зарегистрироваться",
      alreadyHave: "Уже есть аккаунт?",
      terms: "Регистрируясь, вы соглашаетесь с нашими ",
      termsLinks: ["Условиями", "Политикой конфиденциальности", "Политикой cookie"],
    },
    it: {
        text: "Le persone che utilizzano il nostro servizio potrebbero aver caricato le tue informazioni di contatto su Facebook.",
      ianvari: "Gennaio",
      custom: "Altro",
      mamrobiti: "Maschile",
      genders: "Femminile",
      main: "Facebook",
      title: "Crea un nuovo account",
      subtitle: "È veloce e facile.",
      firstName: "Nome",
      lastName: "Cognome",
      birthday: "Compleanno",
      gender: "Genere",
      email: "Email",
      password: "Password",
      signUp: "Registrati",
      alreadyHave: "Hai già un account?",
      terms: "Cliccando su Registrati, accetti i nostri ",
      termsLinks: ["Termini", "Informativa sulla privacy", "Politica sui cookie"],
    },
    de: {
        text: " Personen, die unseren Service nutzen, haben möglicherweise Ihre Kontaktdaten auf Facebook hochgeladen.",
      ianvari: "Januar",
      custom: "Andere",
      mamrobiti: "Männlich",
      genders: "Weiblich",
      main: "Facebook",
      title: "Erstellen Sie ein neues Konto",
      subtitle: "Es ist schnell und einfach.",
      firstName: "Vorname",
      lastName: "Nachname",
      birthday: "Geburtstag",
      gender: "Geschlecht",
      email: "E-Mail",
      password: "Passwort",
      signUp: "Anmelden",
      alreadyHave: "Haben Sie bereits ein Konto?",
      terms: "Indem Sie auf Anmelden klicken, stimmen Sie unseren ",
      termsLinks: ["Nutzungsbedingungen", "Datenschutzbestimmungen", "Cookie-Richtlinie"],
    },
    es: {
        text: " Las personas que usan nuestro servicio pueden haber subido tu información de contacto a Facebook.",
      ianvari: "Enero",
      custom: "Otro",
      mamrobiti: "Masculino",
      genders: "Femenino",
      main: "Facebook",
      title: "Crea una nueva cuenta",
      subtitle: "Es rápido y fácil.",
      firstName: "Nombre",
      lastName: "Apellido",
      birthday: "Cumpleaños",
      gender: "Género",
      email: "Correo electrónico",
      password: "Contraseña",
      signUp: "Registrarse",
      alreadyHave: "¿Ya tienes una cuenta?",
      terms: "Al hacer clic en Registrarse, aceptas nuestros ",
      termsLinks: ["Términos", "Política de privacidad", "Política de cookies"],
    },
    fr: { 
        text: "Les personnes qui utilisent notre service ont peut-être téléchargé vos informations de contact sur Facebook.",
      ianvari: "Janvier",
      custom: "Autre",
      mamrobiti: "Masculin",
      genders: "Féminin",
      main: "Facebook",
      title: "Créez un nouveau compte",
      subtitle: "C'est rapide et facile.",
      firstName: "Prénom",
      lastName: "Nom de famille",
      birthday: "Anniversaire",
      gender: "Genre",
      email: "Email",
      password: "Mot de passe",
      signUp: "S'inscrire",
      alreadyHave: "Vous avez déjà un compte?",
      terms: "En cliquant sur S'inscrire, vous acceptez nos ",
      termsLinks: ["Conditions", "Politique de confidentialité", "Politique de cookies"],
    },
    zh: { 
        text: "使用我们服务的人可能已经将您的联系信息上传到脸书",
      ianvari: "一月",
      custom: "其他",
      mamrobiti: "男性",
      genders: "女性",
      main: "脸书",
      title: "创建新帐户",
      subtitle: "快速又简单。",
      firstName: "名字",
      lastName: "姓",
      birthday: "生日",
      gender: "性别",
      email: "电子邮件",
      password: "密码",
      signUp: "注册",
      alreadyHave: "已经有账户？",
      terms: "点击注册即表示您同意我们的 ",
      termsLinks: ["条款", "隐私政策", "Cookie政策"],
    },
    tr: { 
        text: " Hizmetimizi kullanan kişiler, iletişim bilgilerinizi Facebook'a yüklemiş olabilir.",
      ianvari: "Ocak",
      custom: "Diğer",
      mamrobiti: "Erkek",
      genders: "Kadın",
      main: "Facebook",
      title: "Yeni bir hesap oluştur",
      subtitle: "Hızlı ve kolay.",
      firstName: "Ad",
      lastName: "Soyad",
      birthday: "Doğum Günü",
      gender: "Cinsiyet",
      email: "E-posta",
      password: "Şifre",
      signUp: "Kaydol",
      alreadyHave: "Zaten bir hesabınız var mı?",
      terms: "Kaydol butonuna tıklayarak, bizimle ",
      termsLinks: ["Şartlar", "Gizlilik Politikası", "Çerez Politikası"],
    },
  };
  const t = translations[language];
  return (
    <div className="h-screen overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <h2 className="text-5xl text-blue-600 text-center mt-4">{t.main}</h2>
  
        <div className="flex-grow flex justify-center items-center bg-gray-100">
          {isSignedUp ? (
            <div className="w-full">
              <header className="fixed top-0 left-0 w-full z-50">
                <Header />
              </header>
              <div className="pt-[80px]"></div>
            </div>
          ) : (
            <div className="w-[450px] bg-white p-5 rounded-lg shadow-lg my-8">
              <h2 className="text-2xl font-bold text-center mb-2">{t.title}</h2>
              <h2 className="text-1xl text-center text-gray-600 mb-2">{t.subtitle}</h2>
  
              <div className="flex gap-[10px]">
                <input
                  type="text"
                  placeholder={t.firstName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[200px] h-[40px] p-3 border rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder={t.lastName}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-[200px] h-[40px] p-3 border rounded-lg mb-3"
                />
              </div>
  
              <div className="flex flex-col gap-[5px]">
                <h2 className="text-sm text-gray-600">{t.birthday}</h2>
                <div className="flex gap-[20px] mb-2">
                  <select
                    name="month"
                    className="mb-2 w-[160px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dob.month}
                    onChange={handleDobChange}
                  >
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    name="day"
                    className="mb-2 w-[130px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dob.day}
                    onChange={handleDobChange}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                    ))}
                  </select>
                  <select
                    name="year"
                    className="mb-2 w-[130px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h2 className="text-sm text-gray-600">{t.gender}</h2>
                <div className="flex gap-[30px] mb-2">
                  <label className="mb-2 flex items-center gap-1 border-2 border-solid w-[125px] h-[30px] border-gray-100">
                    <input type="radio" name="gender" value="Female" onChange={handleChange} /> {t.genders}
                  </label>
                  <label className="mb-2 flex items-center gap-1 border-2 border-solid w-[125px] h-[30px] border-gray-100">
                    <input type="radio" name="gender" value="Male" onChange={handleChange} /> {t.mamrobiti}
                  </label>
                  <label className="mb-2 flex items-center gap-1 border-2 border-solid w-[125px] h-[30px] border-gray-100">
                    <input type="radio" name="gender" value="Custom" onChange={handleChange} /> {t.custom}
                  </label>
                </div>
              </div>
  
              <input
                type="text"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] p-3 border rounded-lg mb-3"
              />
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 h-[40px] border rounded-lg mb-3"
              />
  
              <p className="text-xs text-gray-600 leading-tight">
                {t.text}{" "}
                <a href="#" className="text-blue-600 hover:underline">Learn more</a>.
              </p>
              <p className="mt-2 text-xs text-gray-600 leading-tight">
                {t.terms}{" "}
                {t.termsLinks.map((link, index) => (
                  <a key={index} href="#" className="text-blue-600 hover:underline">{link}</a>
                ))}
              </p>
  
              <div className="flex justify-center mt-5">
                <button
                  onClick={handleSignUp}
                  className="bg-green-600 text-white py-2 rounded-lg font-bold w-[240px]"
                >
                  {t.signUp}
                </button>
              </div>
  
              <p className="text-s mt-2 text-blue-500 text-center">{t.alreadyHave}</p>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </div>
          )}
        </div>
  
        {!isSignedUp && (
          <div className="w-full h-[300px] bg-white p-10">
            <div className="whitespace-nowrap  p-4 text-center">
              {["en", "ka", "ru", "it", "de", "es", "fr", "zh", "tr"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 mx-1 rounded ${language === lang ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
  
            <div className="border-t border-gray-300 my-4"></div>
  
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="text-sm text-blue-500">Sign Up</span>
              <span className="text-sm text-blue-500">Login</span>
              <span className="text-sm text-blue-500">Messenger</span>
              <span className="text-sm text-blue-500">Facebook Live</span>
              <span className="text-sm text-blue-500">Video</span>
              <span className="text-sm text-blue-500">Meta Pay</span>
              <span className="text-sm text-blue-500">Meta Store</span>
              <span className="text-sm text-blue-500">Meta Quest</span>
              <span className="text-sm text-blue-500">Ray-Ban Meta</span>
              <span className="text-sm text-blue-500">Meta AI</span>
              <span className="text-sm text-blue-500">Instagram</span>
              <span className="text-sm text-blue-500">Threads</span>
              <span className="text-sm text-blue-500">Voting Information Center</span>
              <span className="text-sm text-blue-500">Privacy Policy</span>
              <span className="text-sm text-blue-500">Privacy Center</span>
              <span className="text-sm text-blue-500">About</span>
              <span className="text-sm text-blue-500">Create ad</span>
              <span className="text-sm text-blue-500">Create Page</span>
              <span className="text-sm text-blue-500">Developers</span>
              <span className="text-sm text-blue-500">Careers</span>
              <span className="text-sm text-blue-500">Cookies</span>
              <span className="text-sm text-blue-500">Ad choices!</span>
              <span className="text-sm text-blue-500">Terms</span>
              <span className="text-sm text-blue-500">Help</span>
              <span className="text-sm text-blue-500">Contact Uploading & Non-Likes</span>
            </div>
  
            <div className="mt-4 text-gray-500">
              Meta © 2025
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SignUpPage;