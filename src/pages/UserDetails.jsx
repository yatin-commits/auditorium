import React, { useState,useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export default function UserDetails() {
  const { email,setName,name } = useAuth();
//   const [name, setName] = useState('');
console.log(name);

  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Correct the URL to point to the backend server
      const response = await fetch('http://localhost:3000/dashboard/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }), // Send the email and name
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Profile updated:', data);
        setRedirect(true);
      } else {
        console.error('Failed to update profile:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    if (redirect) {
      navigate('/dashboard'); // Perform navigation after redirect state changes
    }
  }, [redirect, navigate]);

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          {/* Other content */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              {/* Email field */}
              <div>
                <label className="text-base font-medium text-gray-900"> Email address </label>
                <div className="mt-2">
                  <input
                    value={email}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    type="email"
                    placeholder="Email"
                    readOnly
                  />
                </div>
              </div>
              {/* Name field */}
              <div>
                <label className="text-base font-medium text-gray-900"> Full Name: </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Update state on change
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold text-white hover:bg-black/80"
                >
                  Update Profile <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
