import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Footer from '../components/Footer';
import { useContext } from 'react';
import AuthProvider from '../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext';
function Book() {
  const { email, userName, setUserName,dept,setDept } = useAuth();
  const [value, setValue] = useState(dayjs().startOf('hour'));
  const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
  const [date, setDate] = useState(dayjs());
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [priorityBooking, setPriorityBooking] = useState(false);
  const [bookedby, setBookedBy] = useState("");
  const [feedback, setFeedback] = useState('');
  // const {dept,setDept}=useAuth();
  
  


  useEffect(() => {
    const department = email?.split('@')[1]?.split('.')[0]?.toUpperCase() || 'Unknown Department';
      setDept(department);
      setBookedBy(userName);
    const fetchData = async () => {
      try {
        const formattedDate = date.format('YYYY-MM-DD'); // Ensure date format is correct
        
        // Fetch approved events for the selected date
        const eventsResponse = await fetch(
          `http://localhost:4000/api/approved-events?date=${formattedDate}`
        );
        if (!eventsResponse.ok) {
          throw new Error('Error fetching approved events');
        }
        const eventsData = await eventsResponse.json();
        setApprovedEvents(eventsData);

        // Fetch user information based on email
        const userResponse = await axios.get('http://localhost:4000/getusername', { params: { email } });
        if (!userResponse.status === 200) {
          throw new Error('Error fetching user name');
        }
        setUserName(userResponse.data.name);
      } catch (error) {
        setFeedback(error.message);
      }
    };

    fetchData();
  }, [date, email, setUserName]);

  const handleBookEvent = async () => {
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const formattedStartTime = value.format('HH:mm:ss');
      const formattedEndTime = endTime.format('HH:mm:ss');

      const response = await fetch('http://localhost:4000/api/book-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          event_title: eventTitle,
          event_description: eventDescription,
          date: formattedDate,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          department_name: dept,
          priority: priorityBooking,
          bookedby:userName
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || 'Error booking event');
      } else {
        toast.success('Booking Request Submitted!');
        setEventTitle('');
        setEventDescription('');
        setPriorityBooking(false);
      }
    } catch (error) {
      toast.error('Error placing booking request');
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto p-6">
        <div className='flex justify-between'>
          <h1 className="font-[poppins] text-3xl text-center  p-2">
            Welcome, <span className='text-blue-600  font-bold'> {userName || 'Guest'}</span>
          </h1>
          <h1 className='text-white text-2xl font-mono mb-4 bg-blue-500 p-2 rounded-md  font-semibold'>Dept: {dept}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex justify-center items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                disablePast
                sx={{
                  '& .MuiPickerStaticWrapper-content': {
                    width: '100%',
                    maxWidth: '500px',
                  },
                  '& .MuiPickersDay-root': { fontSize: '1.1rem' },
                  '& .MuiPickersCalendarHeader-root': { marginBottom: '16px' },
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Enter event description"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Start Time"
                    value={value}
                    onChange={setValue}
                  />
                  <TimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(time) => setEndTime(time)}
                  />
                </LocalizationProvider>
              </div>

              {/* Priority Booking Toggle */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Priority Booking:</label>
                <input
                  type="checkbox"
                  checked={priorityBooking}
                  // onClick={!priorityBooking}
                  onChange={(e) => setPriorityBooking(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>

              <button
                onClick={handleBookEvent}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Submit Booking Request
              </button>
              {feedback && (
                <p className="text-center text-red-600 font-medium">{feedback}</p>
              )}
            </div>
          </div>
        </div>

        {/* Approved Events Section */}
        <div className="mt-8">
  <h2 className="text-2xl font-semibold text-center mb-4">Approved Events for {date.format('DD MMM YYYY')}</h2>
  {approvedEvents.length > 0 ? (
    <ul className="space-y-4">
      {approvedEvents.map((event, index) => (
        <li key={index} className="bg-white border rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-600">{event.event_title.toUpperCase()}</h3>
            <span className="text-sm text-black font-semibold font-[poppins] text-l">
              {dayjs(event.start_time, 'HH:mm:ss').format('hh:mm A')} -{' '}
              {dayjs(event.end_time, 'HH:mm:ss').format('hh:mm A')}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">{event.event_description}</p>

          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span className="font-medium">Department:</span>
            <span>{event.department_name}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span className="font-medium">Booked By:</span>
            <span>{event.booked_by}</span>
          </div>

          <div className="mt-2">
            <span className="text-sm text-green-700 font-medium">Approved by: {event.approved_by}</span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-600 text-lg">No approved events for this date 🥳</p>
  )}
</div>


      </div>
      <Footer />
    </>
  );
}

export default Book;
