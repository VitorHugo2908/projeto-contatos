import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmY-VpPtGMZ-KgcN84C5PymrhK0QLRH-c",
  authDomain: "projeto-contatos-683e4.firebaseapp.com",
  projectId: "projeto-contatos-683e4",
  storageBucket: "projeto-contatos-683e4.firebasestorage.app",
  messagingSenderId: "415321420144",
  appId: "1:415321420144:web:7e3f00643dbe6ab6b3dfb5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
