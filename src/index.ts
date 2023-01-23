import { createWebSocketStream, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import Remote from './controllers/Remote.js';
import nut from '@nut-tree/nut-js';
import Former from './services/Former.js';
const wss = new WebSocketServer({ port: 8080 });
const former = new Former();
const connections = {};

wss.on('connection', (ws) => {
	const wsDuplex = createWebSocketStream(ws, { encoding: 'utf-8' });
	const remoteControl = new Remote({ nut, ws, former, wsDuplex });
	const id = uuid();
	connections[id] = ws;
	console.log(`---<=>---  CONNECTION ON: ${connections[id]}`);

	wsDuplex.on('data', remoteControl.handler);
	ws.on('close', () => {
		console.log('--<= =>--  DISCONNECT');
		delete connections[id];
	});
});
wss.on('close', () => {
	process.exit();
});
process.on('exit', () => {
	console.log('----> bye');
});
process.on('SIGINT', () => {
	for (const id of Object.keys(connections)) {
		connections[id].send('server_close_connection');
		connections[id].close();
	}
	wss.close();
	console.log('---OFF--- WEB SOCKET SERVER OFF');
	console.log('wss.close()');
});

export type Nut = typeof nut;
