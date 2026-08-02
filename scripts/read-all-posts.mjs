import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function listBlogs() {
  const snapshot = await getDocs(collection(db, "posts"));
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log("=== ID: " + doc.id + " ===");
    console.log("TITLE: " + data.title);
    console.log("SLUG: " + data.slug);
    console.log("EXCERPT: " + data.excerpt);
    console.log("CONTENT LENGTH: " + (data.content || "").length);
    console.log("------------------------");
  });
}

listBlogs();
