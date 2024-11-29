import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../auth/firebase';
import axios from 'axios'; // Add axios for making requests

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  var [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true); // Start with true to show loading state initially
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState('');
  const [dept,setDept] =useState("demo");

  // Fetch userName from backend based on the email
  const fetchUserName = async (userEmail) => {
    try {
      const userResponse = await axios.get('http://localhost:4000/getusername', { params: { email: userEmail } });
      if (userResponse.status !== 200) {
        throw new Error('Error fetching user name');
      }
      setUserName(userResponse.data.name||" ");
    } catch (error) {
      console.error("Error fetching userName:", error.message);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setEmail(email);
      const department = email?.split('@')[1]?.split('.')[0]?.toUpperCase() || 'Unknown Department';
      setDept(department);


      // Fetch username after successful login
      await fetchUserName(email);
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setEmail(""); // Clear email on logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
  };

  // Use useEffect to track auth state changes and fetch username
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        setEmail(user.email); // Set email when user is logged in
        await fetchUserName(user.email); // Fetch username when user is logged in
      } else {
        setEmail(""); // Clear email when no user is logged in
        setUserName(''); // Clear username when no user is logged in
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    signup,
    setUserName,
    userName,
    email,
    count,
    setCount,
    setPassword,
    setLoading,
    password,
    setEmail,
    currentUser,
    loading,
    login,
    logout,
    auth,
    dept,
    setDept
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
