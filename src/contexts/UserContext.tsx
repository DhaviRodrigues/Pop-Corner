import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/models/user';
import { fetchUserData } from '@/services/userservice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Força uma nova busca ao banco de dados e sincroniza o estado global em memória
  const refreshUser = async () => {
    try {
      const userInstance = await fetchUserData();
      setUser(userInstance);
    } catch (error) {
      console.error("Erro ao sincronizar dados do usuário no contexto:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userInstance = await fetchUserData();
        setUser(userInstance);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);