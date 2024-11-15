import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

// Function to format time to 12-hour clock with AM/PM
const formatTime = (timeStr) => {
  const date = new Date(`1970-01-01T${timeStr}Z`);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
};

// Function to clean up date string
const cleanDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

function AdminPanel() {
  const { email, userName } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState(''); // State for rejection reason
  const [selectedRequestId, setSelectedRequestId] = useState(null); // Track the request being rejected
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Fetch all booking requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/all-requests`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle approval or rejection of requests
  const handleAction = async (id, status) => {
    const reasonToSend = status === 'canceled' && rejectionReason ? rejectionReason : null;

    try {
      const response = await fetch(`http://localhost:4000/api/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          reason: reasonToSend, // send rejection reason as null if empty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      // Update the requests state
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status, rejection_reason: reasonToSend } : request
        )
      );

      setRejectionReason(''); // Reset rejection reason
      setSelectedRequestId(null); // Clear selected request
      setShowModal(false); // Close modal

    } catch (err) {
      console.error(err);
      alert('Failed to update the request');
    }
  };

  // Function to open the rejection reason modal
  const openRejectionModal = (id) => {
    setSelectedRequestId(id);
    setRejectionReason(''); // Reset the rejection reason field
    setShowModal(true); // Show the modal
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div>
        <h1 className="font-[poppins] text-2xl p-4">Welcome, {userName}! 🫡</h1>
        <h1 className="font-[poppins] px-4 text-4xl font-bold text-justify">Booking Requests</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : requests.length === 0 ? (
          <p>No booking requests found.</p>
        ) : (
          <section className="mx-auto w-full max-w-7xl px-4 py-4">
            <div className="mt-6 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Event Title</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Description</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Date</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Start Time</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">End Time</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Status</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {requests.map((request) => (
                          <tr key={request.id}>
                            <td className="whitespace-nowrap px-4 py-4">{request.event_title}</td>
                            <td className="whitespace-nowrap px-4 py-4">{request.event_description}</td>
                            <td className="whitespace-nowrap px-4 py-4">{cleanDate(request.date)}</td>
                            <td className="whitespace-nowrap px-4 py-4">{formatTime(request.start_time)}</td>
                            <td className="whitespace-nowrap px-4 py-4">{formatTime(request.end_time)}</td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  request.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'canceled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              <button
                                onClick={() => handleAction(request.id, 'approved')}
                                className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
                                disabled={request.status === 'approved'}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectionModal(request.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                disabled={request.status === 'canceled'}
                              >
                                Reject
                              </button>
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
      </div>

      {/* Modal for rejection reason */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason for rejection"
              rows="4"
              className="w-full border p-2 rounded-md"
            />
            <div className="mt-4">
              <button
                onClick={() => handleAction(selectedRequestId, 'canceled')}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Reject
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPanel;
