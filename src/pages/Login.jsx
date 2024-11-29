import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../../auth/firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      if (!email.endsWith('@bvicam.in') && email !== "bvicamidforproject@gmail.com") {
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
    <>
      <Navbar />
    <section className="bg-gray-100 min-h-screen flex flex-col justify-center py-10 sm:py-16 lg:py-24">
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-semibold text-gray-800">Please Login to Access</h2>
          <p className="mt-2 text-center text-lg text-gray-600 font-[poppins]">
            Sign in using your official Bvicam ID
          </p>

          <div className="mt-6 space-y-5">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center rounded-md bg-black px-4 py-3 text-white font-semibold hover:bg-black/80 transition ease-in-out duration-300"
              disabled={loading}
            >
              {loading ? 'Signing you in...' : 'Sign in with Google'}
              <ArrowRight className="ml-3" size={20} />
            </button>

            {error && <p className="text-center text-red-500">{error}</p>}
            {success && <p className="text-center text-green-500">{success}</p>}
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              By signing in, you agree to our <a href="#" className="text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-500">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
  );
}
