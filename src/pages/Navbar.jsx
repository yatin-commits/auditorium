import React from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBug, faUser } from '@fortawesome/free-solid-svg-icons';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Book Auditorium', href: '/book' },
  { name: 'My Bookings', href: '/past' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { currentUser, loading, setLoading, email, auth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        await signOut(auth);
        toast('Logged Out Successfully', {
          icon: '😭',
        });
        navigate('/'); // Navigate to home after logout
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = () => {
    if (currentUser) {
      logout();
    } else {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <div className="inline-flex items-center space-x-3">
          <span className="text-white font-bold text-xl">BVP</span>
        </div>
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name} className="hover:underline">
                <Link
                  to={item.href}
                  className="text-white text-lg font-semibold hover:text-gray-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {currentUser?.email === 'bvicamidforproject@gmail.com' && (
              <li>
                <Link 
                  to="/admin" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Manage Requests
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="hidden space-x-2 lg:block">
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={handleAuthAction}
                className="rounded-md mr-2 bg-red-700 text-white border-black px-3 py-2 text-sm font-semibold shadow-sm hover:bg-red-800"
              >
                Log Out
              </button>
              {/* <FontAwesomeIcon className="text-white" icon={faUser} size="lg" /> */}
            </>
          ) : (
            <Link to="/login" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 font-semibold">
              Login
            </Link>
          )}
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 text-white cursor-pointer" />
        </div>

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2">
                <span>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 50 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                      fill="black"
                    />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-4 mt-6">
              {menuItems.map((item) => (
                <li key={item.name} className="text-lg font-semibold">
                  <Link
                    to={item.href}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAuthAction}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                {currentUser ? 'Log Out' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
