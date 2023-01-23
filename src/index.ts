import { createWebSocketStream, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import Remote from './controllers/Remote.js';
import nut from '@nut-tree/nut-js';
import Former from './services/Former.js';
import Msg from './utils/connectionMessages.js';

const msg = new Msg();
const wss = new WebSocketServer({ port: 8080 });
const former = new Former();
const connections = {};

wss.on('connection', (ws) => {
	const wsDuplex = createWebSocketStream(ws, {
		decodeStrings: false,
		encoding: 'utf-8',
	});
	const remoteControl = new Remote({ nut, former, wsDuplex });
	wsDuplex.on('data', remoteControl.handler);

	const id = uuid();
	connections[id] = ws;
	console.log(msg.connectionOn(id));

	ws.on('close', () => {
		console.log(msg.disconnectWith(id));
		wsDuplex.end();
		delete connections[id];
	});
});
wss.on('close', () => {
	process.exit();
});
process.on('exit', () => {
	console.log(msg.goodBye());
});
process.on('SIGINT', () => {
	for (const id of Object.keys(connections)) {
		connections[id].send(msg.wsServerCloseConnection());
		connections[id].close();
	}
	wss.close();
	console.log(msg.wsServerOff());
});

export type Nut = typeof nut;
