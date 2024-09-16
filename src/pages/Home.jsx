import Navbar from './Navbar'
import './home.css'
import HomeCard from '../components/HomeCard'
import { useAuth } from '../contexts/AuthContext'


const Home = () => {
  const { userName } = useAuth();
  return (
    <>
      {/* <Navbar /> */}
      <Navbar/>
      <div>
  <h1 className="font-[poppins] text-2xl sm:text-3xl md:text-3xl lg:text-3xl p-4">
    Welcome <span className="text-green-600 font-semibold capitalize">{userName || ""}</span>
  </h1>
  <div className="font-[poppins] flex justify-center text-center md:text-justify lg:text-justify p-4 pb-2 text-xl sm:text-2xl md:text-3xl font-semibold">
    Welcome to the Auditorium Booking System
  </div>
  <p className="font-[poppins] text-gray-500 flex justify-center md:p-0 px-4 text-justify text-lg lg:p-4  sm:text-xl md:text-2xl">
    Easily manage your auditorium reservations, view past bookings, and track your requests all in one place.
  </p>
</div>

      <div className="flex flex-col sm:flex-row justify-center font-[poppins] space-y-4 sm:space-y-0 sm:space-x-4 p-6">
        <HomeCard
          title='Book Auditorium'
          btn="Book Now"
          sub='Reserve the auditorium for your upcoming events'
          para='Choose your preferred date and time slot for your event. View availability in real-time and make your reservation instantly.'
          to='/book'
        />
        <HomeCard
          title='Past Bookings'
          btn="View History"
          sub='Review your booking history'
          para='Access a comprehensive list of your past reservations. Useful for record-keeping and planning future events.'
          to='/past'
        />
        <HomeCard
          title='Requested Bookings'
          btn="View Requests"
          sub='Track the status of your booking requests'
          para='Monitor the approval status of your pending reservations. Get updates on approved or rejected requests.'
          to='/past'
        />
      </div>
      <div>
        
        <div className='items-center text-center font-[poppins]'  >Designed and Developed by <span className='font-semibold underline'><a href="https://www.linkedin.com/in/yatinsharma01/">Yatin Sharma</a> </span></div>
        

      </div>
    </>
  )
}

export default Home
