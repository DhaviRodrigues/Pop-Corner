import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  favoriteGenres: string[];
  profilePhotoUri?: string;
  profilePhotoFileName?: string;
}

interface UserRegistrationContextType {
  data: UserRegistrationData;
  setData: (data: Partial<UserRegistrationData>) => void;
  resetData: () => void;
}

const UserRegistrationContext = createContext<UserRegistrationContextType | undefined>(undefined);

export const UserRegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<UserRegistrationData>({
    name: '',
    email: '',
    password: '',
    favoriteGenres: [],
    profilePhotoUri: undefined,
    profilePhotoFileName: undefined,
  });

  const setData = (newData: Partial<UserRegistrationData>) => {
    setDataState(prev => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setDataState({
      name: '',
      email: '',
      password: '',
      favoriteGenres: [],
      profilePhotoUri: undefined,
      profilePhotoFileName: undefined,
    });
  };

  return (
    <UserRegistrationContext.Provider value={{ data, setData, resetData }}>
      {children}
    </UserRegistrationContext.Provider>
  );
};

export const useUserRegistration = () => {
  const context = useContext(UserRegistrationContext);
  if (!context) {
    throw new Error('useUserRegistration must be used within a UserRegistrationProvider');
  }
  return context;
};