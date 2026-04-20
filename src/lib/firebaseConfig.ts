import { FirebaseError, FirebaseApp, initializeApp, getApps } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = Constants.expoConfig?.extra as
  | {
      firebaseApiKey?: string;
      firebaseAuthDomain?: string;
      firebaseProjectId?: string;
      firebaseStorageBucket?: string;
      firebaseMessagingSenderId?: string;
      firebaseAppId?: string;
    }
  | undefined;

const firebaseConfig = {
  apiKey: extra?.firebaseApiKey ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "YOUR_API_KEY",
  authDomain:
    extra?.firebaseAuthDomain ??
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "your-project.firebaseapp.com",
  projectId:
    extra?.firebaseProjectId ??
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    "your-project-id",
  storageBucket:
    extra?.firebaseStorageBucket ??
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "your-project.appspot.com",
  messagingSenderId:
    extra?.firebaseMessagingSenderId ??
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    "000000000000",
  appId:
    extra?.firebaseAppId ??
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    "1:000000000000:web:0000000000000000000000",
};

if (__DEV__) {
  const key = firebaseConfig.apiKey ?? "";
  console.log("[Firebase] config check:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyPrefix: key.length > 12 ? `${key.slice(0, 10)}…` : key || "(vazio)",
    looksLikePlaceholder: key === "YOUR_API_KEY" || !key,
  });
}

function createAuth(app: FirebaseApp): Auth {
  if (Platform.OS === "web") {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e: unknown) {
    const code =
      e instanceof FirebaseError ? e.code : (e as { code?: string })?.code;
    if (code === "auth/already-initialized") {
      return getAuth(app);
    }
    throw e;
  }
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = createAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

/** Loga o erro completo do Firebase Auth (Metro / Logcat / Safari Web Inspector). */
export function logFirebaseAuthError(context: string, error: unknown): void {
  const payload: Record<string, unknown> = { context };

  if (error instanceof FirebaseError) {
    payload.code = error.code;
    payload.message = error.message;
    payload.name = error.name;
    const custom = error.customData as Record<string, unknown> | undefined;
    if (custom && Object.keys(custom).length) {
      payload.customData = custom;
    }
  } else if (error instanceof Error) {
    payload.name = error.name;
    payload.message = error.message;
    payload.stack = error.stack;
  } else {
    payload.raw = error;
  }

  console.error("[Firebase Auth]", JSON.stringify(payload, null, 2));
  if (error && typeof error === "object") {
    console.error("[Firebase Auth] error object:", error);
  }
}
