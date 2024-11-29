import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import { MdEvent, MdAccessTime, MdCheckCircle, MdCancel } from 'react-icons/md'; // Importing icons

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

function AdminPanel() {
  const { email, userName } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/all-requests`);
        if (!response.ok) throw new Error('Failed to fetch booking requests');
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = requests.filter(
      (request) =>
        request.event_title.toLowerCase().includes(query) ||
        request.event_description.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
  };

  const handleAction = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${status === 'approved' ? 'approve' : 'reject'} this request?`
    );
    if (!confirmAction) return;

    const reasonToSend = status === 'canceled' ? rejectionReason : null;

    try {
      const response = await fetch(`http://localhost:4000/api/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          reason: reasonToSend,
          approved_by: userName,
          
        }),
      });

      if (!response.ok) throw new Error('Failed to update request');

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status, rejection_reason: reasonToSend } : request
        )
      );
      setFilteredRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status, rejection_reason: reasonToSend } : request
        )
      );

      setRejectionReason('');
      setSelectedRequestId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update the request');
    }
  };

  const openRejectionModal = (id) => {
    setSelectedRequestId(id);
    setRejectionReason('');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, {userName}!</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Booking Requests</h2>

          {/* Search Bar */}
          <div className="mt-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search events by title or description..."
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {loading ? (
            <p className="mt-4 text-lg">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-red-500">{error}</p>
          ) : filteredRequests.length === 0 ? (
            <p className="mt-4 text-lg">No booking requests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between space-y-4"
                >
                  {/* Event Title and Description */}
                  <div className='font-[poppins]'>
                    <h3 className="text-xl font-semibold text-gray-800">{request.event_title.toUpperCase()}</h3>
                    <p className="text-gray-600 mt-1">{request.event_description}</p>
                    <p className="text-gray-600 mt-1">{request.department_name}</p>
                  </div>

                  {/* Event Details */}
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <MdEvent className="text-gray-500 mr-2" />
                      <p><span className="font-medium"></span> {cleanDate(request.date)}</p>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime className="text-gray-500 mr-2" />
                      <p><span className="font-medium"></span> {formatTime(request.start_time)} - {formatTime(request.end_time)}</p>
                    </div>
                    <p><span className="font-medium">Booked By:</span> {request.booked_by || 'Unknown'}</p>
                    {request.approved_by && (
                      <p><span className="font-medium">Approved By:</span> {request.approved_by}</p>
                    )}
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'canceled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {request.status}
                    </span>
                    <span className='font-[poppins]'>{request.priority == 1 ? "Priority : ✅" : null}</span>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleAction(request.id, 'approved')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        {/* <MdCheckCircle className="mr-2" /> */}
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectionModal(request.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        {/* <MdCancel className="mr-2" /> */}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for rejection reason */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Rejection Reason</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason for rejection"
              rows="4"
              className="w-full border p-2 rounded-md text-gray-700"
            />
            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={() => handleAction(selectedRequestId, 'canceled')}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition w-full"
              >
                Reject
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition w-full"
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
