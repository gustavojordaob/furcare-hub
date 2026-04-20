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
import {
  getFirebaseAuth,
  getFirestoreDb,
  logFirebaseAuthError,
} from "../lib/firebaseConfig";

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
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      logFirebaseAuthError("signInWithEmailAndPassword", e);
      throw e;
    }
  }, []);

  const register = useCallback(
    async (nome: string, email: string, password: string) => {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();

      let cred;
      try {
        cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } catch (e) {
        logFirebaseAuthError("register/createUserWithEmailAndPassword", e);
        throw e;
      }

      try {
        // Garante token no cliente antes do Firestore (evita corrida em RN).
        await cred.user.getIdToken(true);
        await setDoc(doc(db, "usuarios", cred.user.uid), {
          nome,
          email: email.trim(),
          criadoEm: serverTimestamp(),
        });
      } catch (e) {
        logFirebaseAuthError(
          "register/setDoc usuarios (Firestore — veja firestore.rules e deploy)",
          e
        );
        throw e;
      }
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
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code !== "auth/email-already-in-use") {
        logFirebaseAuthError(
          "ensureDemoUser/createUserWithEmailAndPassword",
          e
        );
      }
      try {
        await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
      } catch (signInErr) {
        logFirebaseAuthError(
          "ensureDemoUser/signInWithEmailAndPassword",
          signInErr
        );
        throw signInErr;
      }
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
