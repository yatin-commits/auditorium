import React from 'react';
import { Link } from 'react-router-dom';

const HomeCard = ({ title, btn, sub, para, to }) => {
  return (
    <div className="w-full sm:w-80 p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm sm:text-base text-gray-700 mb-4">{sub}</p>
      <p className="text-xs sm:text-sm text-gray-500">{para}</p>
      <Link to={to} className="mt-4 inline-block px-4 py-2 bg-black text-white rounded text-center">
        {btn}
      </Link>
    </div>
  );
}

export default HomeCard;
