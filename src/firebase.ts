import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOuS6K_CwfVuaBp5lD-8OIepJgUGpmwOM",
  authDomain: "phonebook-ea3fc.firebaseapp.com",
  projectId: "phonebook-ea3fc",
  storageBucket: "phonebook-ea3fc.appspot.com",
  messagingSenderId: "231550477015",
  appId: "1:231550477015:web:41fda5d69d755aaef28692",
  measurementId: "G-8XR8FQHC21"
};


export const root = "phone-book";
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
