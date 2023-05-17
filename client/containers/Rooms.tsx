import { useSocket } from "../context/socket.context";
import { useRef } from "react";
import EVENTS from "../config/events";
import styles from "../styles/Rooms.module.css";

function RoomsContainer() {
  const { socket, roomId, rooms } = useSocket();
  const newRoomRef = useRef<HTMLInputElement | null>(null); 

  function handleCreateRoom() {
    const roomName = newRoomRef.current?.value || "";
    if (!String(roomName).trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, roomName);

    if (newRoomRef.current) {
      newRoomRef.current.value = "";
    }
  }

  function handleJoinRoom(key: string) {
    if (key == roomId) {
      return;
    }
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  }

  function handleDeleteRoom(key: string) {
    socket.emit(EVENTS.CLIENT.DELETE_ROOM, key);
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.createRoomWrapper}>
        <div>
          <input ref={newRoomRef} placeholder="Room name" />
          <button onClick={handleCreateRoom} className="cta">CREATE ROOM </button>
        </div>

        <ul className={styles.roomList}>
          {Object.keys(rooms).map((key) => {

            return (
              <div key={key}>
                <button
                  disabled={key === roomId}
                  title={`Join${rooms[key].name}`}
                  onClick={() => handleJoinRoom(key)}
                >
                  {rooms[key].name}
                  
                </button>
                <button className={styles.deleteRoomButton}
                  onClick={() => handleDeleteRoom(key)}
                  >
                Remove
                </button>
              </div>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default RoomsContainer;
