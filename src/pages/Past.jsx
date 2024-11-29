import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import './past.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';


function Past() {
  const { email } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
    
  useEffect(() => {
    const fetchPastBookings = async () => {
      if (!email) return; // Early exit if no email is present

      try {
        const response = await fetch(`http://localhost:4000/past-bookings?email=${email}`);
        if (!response.ok) throw new Error('Failed to fetch past bookings');
        const data = await response.json();
        console.log(data[0].rejection_reason)
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPastBookings();
  }, [email]);

  const formatTime = (timeStr) => {
    const date = new Date(`1970-01-01T${timeStr}Z`);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const cleanDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const openModal = (reason) => {
    setSelectedReason(reason);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReason('');
  };

  return (
    <>
      <Navbar />
      <div>
        <h1 className="font-[poppins] px-4 text-4xl font-bold text-justify">Past Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="p-4 font-[poppins]">No past bookings found.</p>
        ) : (
          <section className="mx-auto w-full max-w-7xl px-4 py-4">
            <div className="mt-6 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 md:rounded-lg tablee">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Status</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Event Title</th>
                          {/* <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 noSee">Description</th> */}
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Date</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 noSee">Start Time</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 noSee">End Time</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 noSee">Priority</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {bookings.map((booking, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  booking.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'canceled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">{booking.event_title}</td>
                            {/* <td className="whitespace-nowrap px-4 py-4 noSee">{booking.event_description}</td> */}
                            <td className="whitespace-nowrap px-4 py-4">{cleanDate(booking.date)}</td>
                            <td className="whitespace-nowrap px-4 py-4 noSee">{formatTime(booking.start_time)}</td>
                            <td className="whitespace-nowrap px-4 py-4 noSee">{formatTime(booking.end_time)}</td>
                            <td className="whitespace-nowrap px-4 py-4 noSee">{booking.priority==1?"✅":null}</td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {booking.status === 'canceled' && booking.rejection_reason ? (
                                <span
                                  onClick={() => openModal(booking.rejection_reason)}
                                  className="cursor-pointer  hover:underline"
                                  title="Click to view reason"
                                >
                                  <FontAwesomeIcon icon={faCircleInfo} />
                                 
                                </span>
                              ) : null
                                
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {showModal && (
         <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-labelledby="modal-title">
         <div className="bg-white p-6 rounded shadow-md w-1/3 max-h-80 overflow-y-auto">
           <h2 id="modal-title" className="text-lg font-bold mb-4">Rejection Reason</h2>
           <p className="whitespace-pre-wrap break-words">{selectedReason}</p>
           <div className="mt-4 flex justify-end">
             <button
               onClick={closeModal}
               className="bg-red-700 text-white px-4 py-2 rounded"
             >
               Close
             </button>
           </div>
         </div>
       </div>
       
        )}
      </div>
    </>
  );
}

export default Past;
