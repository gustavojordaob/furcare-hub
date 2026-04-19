import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import Constants from "expo-constants";

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
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
