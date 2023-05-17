import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { nanoid } from 'nanoid'

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

const rooms: Record<string, { name: string, creator: string, messages: any[] }> = {};

function socket({ io }: { io: Server }) {
    logger.info("Socket.io connection established");

    io.on(EVENTS.connection, (socket: Socket) => {
        logger.info("Socket.io client connected");

        socket.on(EVENTS.CLIENT.GET_ROOMS, () => {
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        socket.on(EVENTS.CLIENT.DELETE_ROOM, (roomId: string) => {
            const room = rooms[roomId];
            if (!room) {
                return;
            }
            if (socket.id !== room.creator) {
                return;
            }
            delete rooms[roomId];
            io.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        socket.on(EVENTS.CLIENT.CREATE_ROOM, (roomName: string) => {
            const roomId = nanoid(10);
            rooms[roomId] = { name: roomName, creator: socket.id, messages: [] };
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
            io.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
            if (rooms[roomId]) {
                socket.emit(EVENTS.SERVER.ROOM_HISTORY, rooms[roomId].messages);
            }
        });

        socket.on(EVENTS.CLIENT.GET_ROOM_HISTORY, (roomId) => {
            if (rooms[roomId]) {
                socket.emit(EVENTS.SERVER.ROOM_HISTORY, rooms[roomId].messages);
            }
        });

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({message, roomId, username}) => {
            const date = new Date();
            const newMessage = {
                message,
                username,
                time: date.getHours() + ":" + date.getMinutes(),
            };
            if (rooms[roomId]) {
                rooms[roomId].messages.push(newMessage);
            }
            io.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, newMessage);
        });
    });
}

export default socket;
