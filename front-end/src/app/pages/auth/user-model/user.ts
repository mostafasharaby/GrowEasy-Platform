export interface User {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface Company {
  arabicName: string;
  englishName: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string;
  logo?: File;
  password: string;
}

export interface Otp {
  email: string;
  otp: string;
}

export interface SetPassword {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}