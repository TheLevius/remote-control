import WebSocket, { WebSocketServer, createWebSocketStream } from 'ws';
import { v4 as uuid } from 'uuid';
import Remote from './controllers/Remote.js';
import nut from '@nut-tree/nut-js';

const remoteControl = new Remote(nut);
const wss = new WebSocketServer({ port: 8080 });
const connections = {};

wss.on('connection', (ws) => {
	const id = uuid();
	connections[id] = ws;
	console.log(`---<=>---  CONNECTION ON: ${id}`);

	ws.on('message', (receivedMsg) => {
		const message = remoteControl.handler(receivedMsg);
		ws.send(message);
	});
	ws.on('close', () => {
		console.log('--<= =>--  DISCONNECT');
		delete connections[id];
	});
});

export type Nut = typeof nut;
