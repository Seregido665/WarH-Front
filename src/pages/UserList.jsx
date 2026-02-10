import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { createChat } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleChatClick = (user) => {
    console.log(`Initiating chat with ${user.id}`);
    createChat({ userId: user.id })
      .then(chat => {
        console.log("Redirect to :", chat.id);
        navigate(`/chat/${chat.id}`);
        // Handle chat creation response if needed
      })
      .catch(error => {
        console.error("Error creating chat:", error);
      });
    // Add your chat initialization logic here
  };

  useEffect(() => {
    // Fetch users from the backend when the component mounts
    getAllUsers().then(response => {
      console.log(response);
      setUsers(response);
      // Handle the response to set users in state if needed
    }).catch(error => {
      console.error("Error fetching users:", error);
    });
  }, []);

  return (
    <div className="user-list">
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleChatClick(user)}>
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
