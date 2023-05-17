import React, { useRef, useEffect } from "react";
import EVENTS from "@/config/events";
import { useSocket } from "../context/socket.context";
import styles from "../styles/Messages.module.css";

function MessagesContainer() {
  const { socket, messages, roomId, username, setMessages, rooms } = useSocket();
  const newMessageRef = useRef<HTMLTextAreaElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  function handleSendMessage() {
    const message = newMessageRef.current?.value || "";
    if (!String(message).trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { message, roomId, username });

    // Add message to the list of messages


    if (newMessageRef.current) {
      newMessageRef.current.value = "";
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault(); // To prevent a newline being added in textarea
      handleSendMessage();
    }
  }

    
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!roomId) {
    return <div className={styles.chatcontainer}>Select a room to start chatting</div>;
  }

  return (
    <div className={styles.chatcontainer}>
      {/* Print the room name */}
      
      <h2 className={styles.chatRoomHeader}>Chat Room: {[roomId]}</h2>
      {messages &&
        messages.map((message, index) => {
          const isSender = username === message.username;
          return (
            <div key={index} className={`${styles.chatmessage} ${isSender ? styles.sender : styles.receiver}`}>
              <p className={styles.chatUsername}>{message.username}</p>
              <p className={styles.chatText}>{message.message}</p>
              <p className={styles.chatTime}>{message.time}</p>
            </div>
          );
        })}
      <div ref={messageEndRef} />
      <div className={styles.chatInput}>
        <textarea rows={1} placeholder="Tell something" ref={newMessageRef} onKeyDown={handleKeyDown} />
        <button onClick={handleSendMessage} className={styles.chatSendbutton}>Send</button>
      </div>
    </div>
  );
}
export default MessagesContainer;
