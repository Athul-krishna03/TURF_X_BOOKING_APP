
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { User } from '../../types/ChatRoomCommunityTypes';

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ChatRoomProps {
  gameId: string;
  userId: string;
}
const socket = io('http://localhost:5000', { autoConnect: false });

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const {gameId,userId} = useParams()
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.emit('joinGame', gameId,userId);

    socket.on('chatRoomData', ({ messages, users }: { messages: Message[]; users: User[] }) => {
      setMessages(messages);
      setUsers(users);
    });

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('messageUpdate', (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)),
      );
    });

    socket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('chatRoomData');
      socket.off('message');
      socket.off('messageUpdate');
      socket.off('error');
      socket.disconnect();
    };
  }, [gameId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', gameId,userId,newMessage);
      setNewMessage('');
    }
  };

  const sendImage = async () => {
    if (image) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        socket.emit('sendImage', gameId, base64Data);
        setImage(null);
        setImageLoading(false);
      };
      reader.readAsDataURL(image);
    }
  };

  const reactToMessage = (messageId: string, reaction: string) => {
    socket.emit('reactToMessage', gameId, messageId, reaction);
  };

  console.log("users",users);
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '400px', margin: 'auto' }}>
      <h3>Chat Room: Game {gameId}</h3>
      <div style={{ marginBottom: '10px' }}>
        <h4>Participants:</h4>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{users.find((u) => u.id === msg.userId)?.name || msg.userId}:</strong>
            {msg.content && <p>{msg.content}</p>}
            {msg.imageUrl && <img src={msg.imageUrl} alt="Chat image" style={{ maxWidth: '100px' }} />}
            <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
            <div>
              {/* {msg.reactions?.map((r, idx) => (
                <span key={idx}>{r.reaction} ({r.userId}) </span>
              ))} */}
              <button onClick={() => reactToMessage(msg.id, '👍')}>👍</button>
              <button onClick={() => reactToMessage(msg.id, '❤️')}>❤️</button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '70%', marginRight: '5px' }}
      />
      <button onClick={sendMessage}>Send</button>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        style={{ marginTop: '10px' }}
      />
      <button onClick={sendImage} disabled={!image || imageLoading} style={{ minWidth: 100 }}>
  {imageLoading ? (
      <span className="spinner" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #ccc', borderTop: '2px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    ) : (
      "Send Image"
    )}
  </button>
    </div>
  );
};

export default ChatRoom;