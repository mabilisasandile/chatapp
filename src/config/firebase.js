
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { collection, doc, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCU68bc_lCGIqD4YKQUAnTjz8Nlve1zu2s",
  authDomain: "chatapp-f8683.firebaseapp.com",
  projectId: "chatapp-f8683",
  storageBucket: "chatapp-f8683.firebasestorage.app",
  messagingSenderId: "415226555758",
  appId: "1:415226555758:web:388d483a596648ff33a57f",
  measurementId: "G-MH7433FTDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey there! I am using ChatApp.",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatsData:[]
        })
        toast.success("Account created successfully!");
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth);
        toast.success("Logged out successfully!");
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success("Password Reset Email Sent")
        }
        else {
            toast.error("Email does not exist")
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
}

export {signup, login, logout, resetPass, auth, db};