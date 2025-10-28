// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA_sAvoNO6ApewEbdb3HaKG1cn3sqmnI0g",
  authDomain: "cpt-app-f3f17.firebaseapp.com",
  projectId: "cpt-app-f3f17",
  storageBucket: "cpt-app-f3f17.appspot.com",
  messagingSenderId: "877393722371",
  appId: "1:877393722371:web:93589ed2f1c98b4de02236",
};

const app = initializeApp(firebaseConfig);

export default app;