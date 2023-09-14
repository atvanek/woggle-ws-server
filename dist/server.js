"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MODE = process.env.NODE_ENV;
const BASE_URL = MODE === 'production' ? 'https://woggle.vercel.app' : 'http://localhost:3000';
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [BASE_URL, 'https://woggle-ws-server-fa4652914358.herokuapp.com/'],
        methods: ['GET', 'POST'],
    },
});
const users = {};
//websocket logic
io.on('connection', (socket) => {
    console.log('connection', socket.id);
    //USER JOINS ROOM
    socket.on('join-room', (user, room, socketId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log('joined room event');
        //add user to room
        yield socket.join(room);
        //retrieve list of socket ids in current room
        const currentRoomSet = (_a = io.sockets.adapter.rooms) === null || _a === void 0 ? void 0 : _a.get(room);
        if (currentRoomSet) {
            const currentRoom = [...currentRoomSet];
            console.log('currentRoom:', currentRoom);
            console.log('socketId:', socketId);
            //generate username if not logged-in
            const username = !user ? `guest${currentRoom.length + 1}` : user;
            const host = currentRoom.length === 1;
            //add user to users obj
            users[socketId] = { username, score: 0, host };
            //grab all usernames in current room
            // const roomUsers = currentRoom.map((socketId) => {
            // 	const { username } = users[socketId];
            // 	return username;
            // });
            console.log('all users:', users);
            //emit user-added event to all users in current room
            // io.in(room).emit('user-added', JSON.stringify(roomUsers));
            // emits username-generated event to new socket
            // io.to(socketId).emit('username-generated', username, host);
        }
    }));
    //USER DISCONNECTS
    socket.on('disconnecting', () => {
        delete users[socket.id];
        console.log('disconnecting', socket.id);
        console.log('users:', users);
    });
});
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
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
//# sourceMappingURL=server.js.map