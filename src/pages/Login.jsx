import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { auth } from '../../auth/firebase'; // Ensure Firebase is initialized in this file
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast'; // Import react-hot-toast
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './Navbar';
// import 'react-hot-toast/dist/index.css'; // Import react-hot-toast CSS (if needed for your setup)

export function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const { email, setEmail, password, setPassword, login } = useAuth();
  // console.log(login);
  const[loading,setLoading]=useState(false);
  
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      await login(email, password);
      toast.success('Login successful! Data saved to MySQL');
      navigate('/');  
    } catch (error) {
      console.error('Error during login or saving user data:', error);
      toast.error('Login failed or saving user data failed');
    } finally {
      setLoading(false);
    }
  };

  

  return (

    <section>
      <Navbar/>
      {/* <p>We are Under testing phase so we allow all users the access to login and booking!!</p> */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Please Login to Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link className="text-black underline font-[poppins]" to="/newacc">
            Create an account</Link>
          </p>
          <form action="#" method="POST" className="mt-8" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  <a href="#" title="Forgot password?" className="text-sm font-semibold text-black hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  {loading ? 'Logging you....' : 'Log In'} <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
