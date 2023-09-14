import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const MODE = process.env.NODE_ENV;
const BASE_URL =
	MODE === 'production' ? 'https://woggle.vercel.app' : 'http://localhost:3000';

const app = express();
const PORT = process.env.PORT as string | 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: [BASE_URL, 'https://woggle-ws-server-fa4652914358.herokuapp.com/'],
		methods: ['GET', 'POST'],
	},
});

// import generateLetters from '../utils/generateLetters.js';

//username, room, websocket, score data
type User = {
	username: string;
	score: number;
	host: boolean;
};
type Users = {
	[socketId: string]: User;
};
const users: Users = {};

//websocket logic
io.on('connection', (socket) => {
	console.log('connection', socket.id);
	//USER JOINS ROOM
	socket.on(
		'join-room',
		async (user: string, room: string, socketId: string) => {
			console.log('joined room')
			//add user to room
			await socket.join(room);
			//retrieve list of socket ids in current room
			const currentRoomSet = io.sockets.adapter.rooms?.get(room);
			if (currentRoomSet) {
				const currentRoom = [...currentRoomSet];
				console.log(currentRoom)
				console.log(socketId, 'socketId')
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
				console.log(users)
				//emit user-added event to all users in current room
				// io.in(room).emit('user-added', JSON.stringify(roomUsers));
				// emits username-generated event to new socket
				// io.to(socketId).emit('username-generated', username, host);
			}
		}
	);
	//USER DISCONNECTS
	socket.on('disconnecting', () => {
		console.log('disconnecting', socket.id);
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
