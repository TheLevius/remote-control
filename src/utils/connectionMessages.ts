export default class {
	constructor() {}
	connectionOn = (id: string): string => `---<=>---  CONNECTION ON: ${id}`;
	disconnectWith = (id: string): string => `--<= =>--  DISCONNECT WITH:${id}`;
	wsServerOff = (): string => `---OFF--- WEB SOCKET SERVER IS OFF`;
	wsServerCloseConnection = (): string => `SERVER_CLOSE_CONNECTION`;
	goodBye = (): string => `Good Bye!`;
}
