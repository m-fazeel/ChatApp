import { io, Socket } from "socket.io-client";

const EVENTS = {
    connection: "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        DELETE_ROOM: "DELETE_ROOM", // New Event for Deleting Room
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
        GET_ROOMS: "GET_ROOMS",
        GET_ROOM_HISTORY: "GET_ROOM_HISTORY", // New event to get room history
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
        ROOM_HISTORY: "ROOM_HISTORY", // New event to send room history
    },
};

let socket: Socket;

function connect() {
    socket = io('https://chat-app-m-fazeel.vercel.app/'); // Update this URL to your server's URL

    socket.on(EVENTS.SERVER.JOINED_ROOM, (roomId) => {
        console.log(`Joined room: ${roomId}`);
    });

    socket.on(EVENTS.SERVER.ROOMS, (rooms) => {
        console.log('Rooms:', rooms);
    });

    socket.on(EVENTS.SERVER.ROOM_MESSAGE, (message) => {
        console.log('New message:', message);
    });

    socket.on(EVENTS.SERVER.ROOM_HISTORY, (history) => {
        console.log('Room history:', history);
    });
}

function getRooms() {
    socket.emit(EVENTS.CLIENT.GET_ROOMS);
}

function createRoom(roomName: string) {
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, roomName);
}

function deleteRoom(roomId: string) {
    socket.emit(EVENTS.CLIENT.DELETE_ROOM, roomId);
}

function joinRoom(roomId: string) {
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, roomId);
}

function getRoomHistory(roomId: string) {
    socket.emit(EVENTS.CLIENT.GET_ROOM_HISTORY, roomId);
}

function sendMessage({ message, roomId, username }: { message: string; roomId: string; username: string; }) {
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { message, roomId, username });
}

export default {
    connect,
    getRooms,
    createRoom,
    deleteRoom,
    joinRoom,
    getRoomHistory,
    sendMessage
}
