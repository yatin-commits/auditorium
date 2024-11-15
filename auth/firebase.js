
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjAOGcXUsO_zP80i1m-Qi-8oGrPWFH7WY",
  authDomain: "auditoriumbookings.firebaseapp.com",
  projectId: "auditoriumbookings",
  storageBucket: "auditoriumbookings.appspot.com",
  messagingSenderId: "734951207468",
  appId: "1:734951207468:web:ba8835bed6102470151789",
  measurementId: "G-5K138MH3JP"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth,googleProvider};