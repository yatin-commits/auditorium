import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../../auth/firebase'; // Ensure Firebase is initialized and Google Provider is configured
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGoogle } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading to true when sign-in starts
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;
      const name = user.displayName; // Use the user's name from the Google account

      // Check if the email ends with @bvicam.in
      if (!email.endsWith('@bvicam.in') && email!="bvicamidforproject@gmail.com") {
        alert('Only @bvicam.in email addresses are allowed to log in.');
        auth.signOut();  // Immediately sign out the user
        setLoading(false);
        return;
      }

      // Proceed if email is valid
      try {
        const response = await axios.post('http://localhost:4000/addUser', { name, email });
        setSuccess(response.data); // Handle success response
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error registering user:', err);
        setError('Error registering user.');
      }

      console.log('User logged in:', user);
      navigate('/');
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false); // Stop loading once the process is complete
    }
  };

  return (
    <section>
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Please Login to Access
          </h2>
          <p className="mt-2 text-center  text-gray-600 font-[poppins] text-xl">
            Sign in using official Bvicam Id
          </p>

          <div className="mt-8 space-y-5">
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
              disabled={loading}
            >
              {loading ? 'Signing you in...' : 'Sign in with Google '}
              <ArrowRight className="ml-2" size={16} />
            </button>

            {error && <p className="text-center text-red-500">{error}</p>}
            {success && <p className="text-center text-green-500">{success}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
  