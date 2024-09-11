import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user list.");
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Lista Użytkowników</h1>
      <ul className="list-group">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="list-group-item">
              {user.username} - {user.email}
            </li>
          ))
        ) : (
          <li className="list-group-item">No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default UserListPage;
