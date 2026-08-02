import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGFk8Cr9PYUgjuoKDGu_waSZJAn7y1Mhw",
  authDomain: "zihadhasan.firebaseapp.com",
  projectId: "zihadhasan",
  storageBucket: "zihadhasan.firebasestorage.app",
  messagingSenderId: "209783034748",
  appId: "1:209783034748:web:26028c4398d3e4cb144af9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function readPost() {
  const docSnap = await getDoc(doc(db, "posts", "64d60EXxZmp1g7YV2WIf"));
  if (docSnap.exists()) {
    console.log(docSnap.data().content);
  }
}

readPost();
