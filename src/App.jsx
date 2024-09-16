
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Book from './pages/Book';
import Past from './pages/Past';
import CreateAcc from './pages/CreateAcc';
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel';
// import PrivateRoute from './pages/ProtectedRoute';
import ProtectedRoute from './pages/ProtectedRoute';
import { AdminRoute } from './pages/AdminRoute';
import NotFound from './pages/NotFound';
import Unauthorised from './pages/Unauthorised';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/newacc" element={<CreateAcc />} />
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<ProtectedRoute><Book /></ProtectedRoute>} />
      <Route path="/past" element={<ProtectedRoute><Past /></ProtectedRoute>} />
      <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      {/* Other routes */}
      <Route path="/unauthorized" element={<Unauthorised />}/>
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;
