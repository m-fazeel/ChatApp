// EVENTS.ts
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

export default EVENTS;
