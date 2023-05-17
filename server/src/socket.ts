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
    },

    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
    },
};


// create an object to store the rooms without key

const rooms: Record<string, { name: string, creator: string }> = {};
function socket({ io }: { io: Server }) {
    logger.info("Socket.io connection established");

    io.on(EVENTS.connection, (socket: Socket) => {
        logger.info("Socket.io client connected");

        // Emit the rooms to the user who joined
        socket.on(EVENTS.CLIENT.GET_ROOMS, () => {
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        // When we get a delete room event
        socket.on(EVENTS.CLIENT.DELETE_ROOM, (roomId: string) => {
            const room = rooms[roomId];

            // Check if room exists
            if (!room) {
                return;
            }

            // Check if the current socket.id is the same as the creator of the room
            if (socket.id !== room.creator) {
                return;
            }

            // If the conditions pass, delete the room
            delete rooms[roomId];
            io.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        socket.on(EVENTS.CLIENT.CREATE_ROOM, (roomName: string) => {
            const roomId = nanoid(10);
            // Store the creator's socket id with the room information
            rooms[roomId] = { name: roomName, creator: socket.id };

            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);

            io.emit(EVENTS.SERVER.ROOMS, rooms);
        });

        // when user joins the room
        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });

        // When a user sends a room message
        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({message, roomId, username}) => {
            const date = new Date();
            io.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: date.getHours() + ":" + date.getMinutes(),
            });
        });
    });
}

export default socket;