import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminPanel";
import CreateEvent from "./components/CreateEvent";
import EditEvent from "./components/EditEvent";
import EditUser from "./components/EditUser";
import EventDetail from "./components/EventDetails";
import EventsList from "./components/Events";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import UserDetailPage from "./components/UserDetails";
import UserListPage from "./components/UsersList";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/create_event" element={<CreateEvent />} />
        <Route path="/edit_event/:eventId" element={<EditEvent />} />
        <Route path="/edit_user/:userId" element={<EditUser />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/users_details/:userId" element={<UserDetailPage />} />
        <Route path="/users" element={<UserListPage />} />
        {/* Add routes for other components */}
      </Routes>
    </Router>
  );
};

export default App;
