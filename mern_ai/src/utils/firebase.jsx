import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyADL-ECa00FEj3Q4rzyZk-p2-ZtgPP3iaY",
  authDomain: "mernai-85787.firebaseapp.com",
  projectId: "mernai-85787",
  storageBucket: "mernai-85787.firebasestorage.app",
  messagingSenderId: "344398101323",
  appId: "1:344398101323:web:975d6eba8ebd1a9ca2c6ce",
  measurementId: "G-K5K2PQS5H1"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};