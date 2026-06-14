import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/models/user';
import { fetchUserData, verifyAdmin } from '@/services/userservice';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Platform } from 'react-native';

const IS_ADM_KEY = '@PopCorner:is_adm';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return localStorage.getItem(IS_ADM_KEY) === 'true';
    }
    return false;
  });

  const checkAdminPrivileges = async (userInstance: User | null) => {
    if (!userInstance) {
      setIsAdmin(false);
      if (Platform.OS === 'web' && typeof window !== 'undefined') localStorage.removeItem(IS_ADM_KEY);
      return;
    }

    const adminResult = await verifyAdmin();
    const adminStatus = !!(adminResult.valid && adminResult.isAdmin);
    
    setIsAdmin(adminStatus);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (adminStatus) {
        localStorage.setItem(IS_ADM_KEY, 'true');
      } else {
        localStorage.removeItem(IS_ADM_KEY);
      }
    }
  };

  const refreshUser = async () => {
    try {
      const userInstance = await fetchUserData();
      setUser(userInstance);
      await checkAdminPrivileges(userInstance);
    } catch (error) {
      console.error("Erro ao sincronizar dados do usuário no contexto:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        localStorage.removeItem(IS_ADM_KEY);
      }
    } catch (error) {
      console.error("Erro ao executar logout no provedor:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          const userInstance = await fetchUserData();
          setUser(userInstance);
          await checkAdminPrivileges(userInstance);
        } catch (e) {
          console.error("Erro ao reidratar sessão:", e);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          localStorage.removeItem(IS_ADM_KEY);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);