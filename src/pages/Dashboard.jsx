import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from './Navbar';
import Book from './Book';

const Dashboard = () => {
  const { email, name } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {

    navigate('/');
  };

  return (
    <>
      <Navbar />
      <Book/>
      <h1 onClick={handleLogout}>Welcome {email} </h1>
    </>
  );
};

export default Dashboard;
