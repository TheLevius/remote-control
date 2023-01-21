import WebSocket from 'ws';
import { Nut } from '../index.js';

export default class {
	nut: Nut;
	constructor(nut: Nut) {
		this.nut = nut;
	}
	handler = (msg: WebSocket.RawData) => {
		const [action, specific, ...strValues]: string[] = msg
			.toString()
			.split(/[_ ,]/);
		const intValues: number[] = strValues.map((strValue) =>
			parseInt(strValue)
		);
		this[action](specific, intValues);
		return `${action}_${specific}_${strValues}`;
	};

	mouse = async (spec: string, args: number[]): Promise<void> => {
		try {
			await this.nut.mouse.move(this.nut[spec](...args));
		} catch (err) {
			console.error(err);
		}
	};

	draw = async (figure: Figures, args: number[]) => {
		try {
			const theFigure = this[figure](...args);
			for (const [dir, value] of theFigure) {
				await this.move(dir, value);
			}
		} catch (err) {
			console.error(err);
		}
	};

	square = (size: number): [string, number][] =>
		['right', 'down', 'left', 'up'].map((dir) => [dir, size]);

	rectangle = (width: number, height: number): [string, number][] =>
		['right', 'down', 'left', 'up'].map((dir, i) => [
			dir,
			i % 2 === 0 ? width : height,
		]);

	// prnt = () => {};

	move = async (direction: string, value: number) =>
		await this.nut.mouse.move(this.nut[direction](value));
}

type Figures = 'rectangle' | 'square' | 'circle';
type Actions = 'mouse' | 'draw' | 'prnt';
