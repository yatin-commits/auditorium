import Navbar from './Navbar';
import './home.css';
import HomeCard from '../components/HomeCard';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const Home = () => {
  const { userName } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Welcome Section */}
      <div className="flex flex-col flex-grow">
        <div className="bg-slate-800 p-8 ">
          <h1 className="font-[poppins] text-3xl sm:text-4xl lg:text-5xl text-white text-center">
            Welcome <span className="text-yellow-300 font-semibold capitalize">{userName || "Guest"}</span>
          </h1>
          <div className="font-[poppins] text-white text-center text-lg sm:text-xl md:text-2xl mt-4">
            Welcome to the Auditorium Booking System
          </div>
          <p className="font-[poppins] text-white text-center text-lg sm:text-xl md:text-2xl mt-6 px-4 md:px-12 lg:px-24">
            Easily manage your auditorium reservations, view past bookings, and track your requests.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6">
          <HomeCard
            title="Book Auditorium"
            btn="Book Now"
            sub="Reserve the auditorium for your upcoming events"
            para="Choose your preferred date and time slot for your event. View availability in real-time and make your reservation instantly."
            to="/book"
          />
          <HomeCard
            title="Past Bookings"
            btn="View History"
            sub="Review your booking history"
            para="Access a comprehensive list of your past reservations. Useful for record-keeping and planning future events."
            to="/past"
          />
          <HomeCard
            title="Requested Bookings"
            btn="View Requests"
            sub="Track the status of your booking requests"
            para="Monitor the approval status of your pending reservations. Get updates on approved or rejected requests."
            to="/past"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
