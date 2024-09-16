import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { email, setEmail, password, setPassword, login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("hi"+loading);
    

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await login(email, password);
      navigate('/home')
      // await toast.promise(
      //   // setTimeout(() => {
      //     login(email, password),
      //   {
      //     loading: 'Signing in...',
      //     success: 'Sign in successful!',
      //     error: 'Error signing in!',
      //   }
          
      //   // }, 2000)
      // );
      // setTimeout(() => {
        
      //   navigate('/book');
      // }, 3000);
    } catch (error) {
      console.error('Error signing in:', error.message);
      toast.error('Error signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Toaster position="top-center" reverseOrder={false} />
      <section>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="mb-2 flex justify-center">
              <svg width="50" height="56" viewBox="0 0 50 56" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-black">Book Auditorium!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Login with Registered Email only!
              <a href="/signup" className="font-semibold text-black transition-all duration-200 hover:underline"></a>
            </p>
            <form onSubmit={handleSignIn} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">Password</label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    disabled={loading}
                  >
                    Get started <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">
              <button
                type="button"
                className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
              >
                Guest Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
