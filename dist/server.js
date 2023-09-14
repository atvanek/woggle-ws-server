"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MODE = process.env.NODE_ENV;
const BASE_URL = MODE === 'production' ? 'https://woggle.vercel.app' : 'http://localhost:3000';
const app = (0, express_1.default)();
const PORT = MODE === 'production' ? 3000 : 8080;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: BASE_URL,
        methods: ['GET', 'POST'],
    },
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: BASE_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
//global error handler
app.use((err, _req, res, _next) => {
    console.log(err);
    res.status(500).send({ error: err });
});
// import generateLetters from '../utils/generateLetters.js';
//username, room, websocket, score data
const users = {};
//websocket logic
io.on('connection', (socket) => {
    console.log('connection', socket.id);
    //USER JOINS A ROOM
    // socket.on('join-room', async (user, room, socketId) => {
    // 	//add user to room
    // 	await socket.join(room);
    // 	console.log('room join');
    // 	//retrieve list of socket ids in current room
    // 	const currentRoom = [...io.sockets.adapter.rooms?.get(room)];
    // 	//generate username if not logged-in
    // 	const username = !user ? `guest${currentRoom.length + 1}` : user;
    // 	const host = currentRoom?.length === 1;
    // 	//add user to users obj
    // 	users[socketId] = { username, score: 0, host };
    // 	//grab all usernames in current room
    // 	const roomUsers = currentRoom?.map((socketId) => {
    // 		const { username } = users[socketId];
    // 		return username;
    // 	});
    // 	//emit user-added event to all users in current room
    // 	io.in(room).emit('user-added', JSON.stringify(roomUsers));
    // 	// emits username-generated event to new socket
    // 	io.to(socketId).emit('username-generated', username, host);
    // });
    // socket.on('new-board', (room) => {
    // 	//adds board to room
    // 	socket.join(room);
    // });
    // //GAME STARTED
    // socket.on('game-start', (id, duration) => {
    // 	const letters = generateLetters();
    // 	console.log('duration is', duration);
    // 	//lets all rooms know letters are ready to be rendered
    // 	io.in(id).emit('letters-ready', letters, duration);
    // });
    // //UPDATE SCORE
    // socket.on('update-score', (room, score, socketId) => {
    // 	const currentRoom = [...io.sockets.adapter.rooms?.get(room)];
    // 	//set new score for current user
    // 	users[socketId].score = score;
    // 	//grab username and scores of all players in room
    // 	const scores = currentRoom?.map((socketId) => {
    // 		const { username, score } = users[socketId];
    // 		return { username, score };
    // 	});
    // 	//send new scores to all players
    // 	io.in(room).emit('new-scores', JSON.stringify(scores));
    // });
    // //GAME ENDED
    // socket.on('game-end', (room) => {
    // 	const currentRoom = [...io.of('/').adapter.rooms?.get(room)];
    // 	const scores = currentRoom?.map((socketId) => {
    // 		const { username, score } = users[socketId];
    // 		return { username, score };
    // 	});
    // 	//send final scores to all players
    // 	io.in(room).emit('end-game', JSON.stringify(scores));
    // });
    //USER LEAVES ROOM
    socket.on('disconnecting', () => {
        console.log('disconnecting', socket.id);
    });
});
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
//# sourceMappingURL=server.js.map