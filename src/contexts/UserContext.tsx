import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean; // Adicionado para sabermos se o app está checando o F5
  logout: () => Promise<void>; // Mudou para Promise porque o Firebase desloga de forma assíncrona
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true enquanto checa o cache
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const updatedUser = await User.fetchUserData();
          setUser(updatedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao sincronizar usuário pós-F5:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.warn("Erro ao deslogar do Firebase:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}