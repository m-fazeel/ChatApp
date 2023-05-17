import { createContext, useContext , useState, useEffect} from 'react';
import io, {Socket} from 'socket.io-client';
import { SOCKET_URL } from '../config/default'
import EVENTS from '../config/events';

interface Room {
    name: string;
    creator: string;
}

interface Context{
    socket: Socket;
    username?: string;
    setUsername: Function;
    roomId?: string;
    // Array of rooms of type {name: string}
    rooms: Record<string, Room>;
    messages?: { message: string; time: string; username: string }[];
    setMessages: Function;
}


const socket = io(SOCKET_URL)

const SocketContext = createContext<Context>(
    {
        socket,
        setUsername: () => false,
        rooms: {},
        messages: [],
        setMessages: (value: { message: string; username: string; time: string }[]) => {},
    }
);

function SocketsProvider(props: any) {

    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState<Record<string, Room>>({});
    const [messages, setMessages] = useState<{ message: string; username: string; time: string }[]>([]);


    useEffect(() => {
        window.onfocus = () => {
            document.title = "Chat App";
        };

        // Show message on window title if the window is not focused
        window.onblur = () => {
            document.title = `(${messages.length}) Chat App`;
        };

        socket.on(EVENTS.SERVER.ROOMS, (value: any) => {
            setRooms(value);
        });

        socket.emit(EVENTS.CLIENT.GET_ROOMS);

        socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
            setRoomId(value);
            setMessages([]);
        });

        socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
            // Show message on window title if the window is not focused
            if (document.visibilityState !== "visible") {
                document.title = `(${messages.length + 1}) Chat App`;
            }

            
            setMessages((messages) => [...messages, { message, username, time }]);
        });

        // When the component is unmounted, remove the event listeners
        return () => {
            socket.off(EVENTS.SERVER.ROOMS);
            socket.off(EVENTS.SERVER.JOINED_ROOM);
            socket.off(EVENTS.SERVER.ROOM_MESSAGE);
        };
    }, []);


    return <SocketContext.Provider value={{ socket, username, setUsername, rooms, roomId,messages, setMessages }} {...props} />
}

export const useSocket = () => useContext (SocketContext);
export default SocketsProvider;
