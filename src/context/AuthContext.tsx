import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb } from "../lib/firebaseConfig";

const DEMO_EMAIL = "demo@furcare.local";
const DEMO_PASSWORD = "furcare123";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (nome: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  ensureDemoUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const register = useCallback(
    async (nome: string, email: string, password: string) => {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nome,
        email: email.trim(),
        criadoEm: serverTimestamp(),
      });
    },
    []
  );

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  }, []);

  const ensureDemoUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        DEMO_EMAIL,
        DEMO_PASSWORD
      );
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nome: "Conta Demo",
        email: DEMO_EMAIL,
        criadoEm: serverTimestamp(),
      });
    } catch {
      await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      register,
      signOutUser,
      ensureDemoUser,
    }),
    [user, loading, signIn, register, signOutUser, ensureDemoUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
