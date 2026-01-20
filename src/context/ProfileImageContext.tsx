import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProfileImageContextType {
  profileImage: string;
  setProfileImage: (image: string) => void;
}

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(undefined);

interface ProfileImageProviderProps {
  children: ReactNode;
}

export const ProfileImageProvider: React.FC<ProfileImageProviderProps> = ({ children }) => {
  const [profileImage, setProfileImage] = useState('usu.webp'); // Imagen por defecto

  return (
    <ProfileImageContext.Provider value={{
      profileImage,
      setProfileImage
    }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => {
  const context = useContext(ProfileImageContext);
  if (context === undefined) {
    throw new Error('useProfileImage must be used within a ProfileImageProvider');
  }
  return context;
};