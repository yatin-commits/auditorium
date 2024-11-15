import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Calendar from 'react-calendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './book.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

function Book() {
  const { email, userName, setUserName } = useAuth();
  const [value, setValue] = useState(dayjs().startOf('hour'));
  const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
  const [date, setDate] = useState(new Date());
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved events
        const eventsResponse = await fetch(`http://localhost:4000/api/approved-events?date=${date.toISOString().split('T')[0]}`);
        if (!eventsResponse.ok) {
          throw new Error('Error fetching approved events');
        }
        const eventsData = await eventsResponse.json();
        setApprovedEvents(eventsData);

        // Fetch user name
        const userResponse = await axios.get('http://localhost:4000/getusername', { params: { email } });
        if (!userResponse.status === 200) {
          throw new Error('Error fetching user name');
        }
        setUserName(userResponse.data.name);
        console.log(userName);
        
      } catch (error) {
        console.error(error.message);
        setFeedback(error.message);
      }
    };

    fetchData();
  }, [date, email, setUserName,userName]);
  console.log(userName);
  

  const handleBookEvent = async () => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const formattedStartTime = value.format('HH:mm:ss');
      const formattedEndTime = endTime.format('HH:mm:ss');

      const response = await fetch('http://localhost:4000/api/book-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email,
          event_title: eventTitle,
          event_description: eventDescription,
          date: formattedDate,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || 'Error booking event');
      }
      else{
        toast.success('Booking Request Submitted!');
      setEventTitle('');
      setEventDescription('');
      }
      
    } catch (error) {
      console.error("Error Placing Request",error);
      // setFeedback('Error booking event');
    }
  };

  return (
    <>
      <Navbar />
      <div>
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="font-[poppins] text-2xl p-4">Welcome {userName||"guest"}😉</h1>
        {/* <h1>{email}</h1> */}
        <h1 className="font-[poppins] p-4 text-4xl font-bold text-justify">Book Auditorium.</h1>
        <h1 className='px-4 text-center m-3 font-[poppins] text-2xl '>Check Availability</h1>
        <div className="flex p-4 justify-evenly calander-container">
          <Calendar className="font-[poppins] rounded-lg font-bolder" onChange={setDate} value={date} />
          <div className="px-4 text-justify showBookings">
  <h2 className="text-center font-[poppins] text-2xl font-semibold mb-6">
    Slots For {date.toDateString()}
  </h2>
  {approvedEvents.length > 0 ? (
    <ul className="grid gap-6">
      {approvedEvents.map((event, index) => (
        <li
          key={index}
          className="border border-gray-200 rounded-lg shadow-lg p-5 bg-white hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex flex-col mb-4">
            <h1 className="text-xl font-bold text-gray-800">{event.event_title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {event.start_time} - {event.end_time}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{event.teacher_name}</span>
            <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
              Approved
            </span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center font-[poppins] text-xl mt-4 text-gray-600">
      No Booked events for this date 🥳.
    </p>
  )}
</div>

        </div>
        <div className="flex justify-center p-3 space-x-5">
          <div className="flex flex-col justify-center items-center w-full h-full ">
          <h1 className="text-3xl font-[poppins] m-3">
  Book New Event <FontAwesomeIcon icon={faArrowDown} />
</h1>

            <div className="flex flex-row booknew">
              <div className="mt-4 flex flex-col w-96">
                <div className="p-5">
                  <label htmlFor="eventTitle" className="text-base font-medium text-gray-900">Event Title:</label>
                  <div className="mt-2">
                    <input
                      id="eventTitle"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="p-4 rounded-md w-full"
                      type="text"
                      placeholder="Event Title"
                    />
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <label htmlFor="eventDescription" className="text-base font-medium text-gray-900 ">Event Description:</label>
                  <div className="mt-2">
                    <textarea
                      id="eventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="p-4 rounded-md w-full"
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col p-5 space-y-8 justify-center items-center">
                  <DemoContainer components={['TimePicker']}>
                    <TimePicker label="Event Starting Time" value={value} onChange={setValue} />
                  </DemoContainer>
                  <DemoContainer components={['TimePicker']}>
                    <TimePicker label="Event Ending Time" value={endTime} onChange={setEndTime} />
                  </DemoContainer>
                </div>
              </LocalizationProvider>
            </div>
            <button onClick={handleBookEvent} className="block mb-6 p-3 rounded-md font-[poppins] bg-black text-white">Place Booking Request</button>
            {feedback && <p className="text-center mt-4">{feedback}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Book;
