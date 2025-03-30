
export interface Translation {
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
  }
  export type Translations = {
    [key: string]: Translation;
  };