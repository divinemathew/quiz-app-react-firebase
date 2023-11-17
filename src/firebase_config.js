// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA2fabM2odGxA-fRUsVUbsZz49s_rjQdTs",
    authDomain: "test-ed4cc.firebaseapp.com",
    projectId: "test-ed4cc",
    storageBucket: "test-ed4cc.appspot.com",
    messagingSenderId: "689692823997",
    appId: "1:689692823997:web:f855e8e5f6be35a99142d4",
    measurementId: "G-TH4N5FKW35"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db =  getFirestore(app);
// const analytics = getAnalytics(app);