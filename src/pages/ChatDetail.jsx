import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getChat } from '../services/chatService';
import AuthContext from '../contexts/authContext';
import { sendNewMessage } from '../services/message.service';

const ChatDetail = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    // Logic to send the new message
    console.log("Sending message:", {
      text: newMessage,
      chatId: id
    });
    sendNewMessage({
      text: newMessage,
      chatId: id
    });
  }

  const fetchChat = useCallback(() => {
    getChat(id)
      .then(response => {
        console.log(response);
        setChat(response);
      }).catch(error => {
        console.error("Error fetching chat:", error);
      });
  }, [id]);

  useEffect(() => {
    fetchChat();
    const myInterval = setInterval(() => {
      fetchChat();
    }, 1000);

    return () => clearInterval(myInterval);
  }, [fetchChat]);

  if (!chat) {
    return <div>Loading chat...</div>;
  }

  const otherParticipant = chat.participants.find(p => p.id !== user._id);

  const isMyMessage = (message) => {
    console.log("Comparing", message.sender, "with", user._id);
    return message.sender === user._id;
  };

  return (
    <div className="chat-detail">
      <div className="chat-header">
        <div className="participant-info">
          <div className="participant-details">
            <h3>{otherParticipant?.email}</h3>
            <span className="status">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`message ${isMyMessage(message) ? 'bg-secondary' : 'bg-warning'}`}
          >
            {!isMyMessage(message) && (
              <img
                src={message.sender.avatar || 'https://via.placeholder.com/32'}
                alt={message.sender.name}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              <div className="message-bubble">
                <p>{message.text} -  fecha</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form className="message-form" onSubmit={handleSubmitMessage}>
        <div className="message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div >
  );
};

export default ChatDetail;
