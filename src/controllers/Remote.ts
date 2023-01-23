import WebSocket from 'ws';
import { Button, FileType, Point, Region, screen } from '@nut-tree/nut-js';
import { Nut } from '../index.js';
import { join } from 'node:path';
import Jimp from 'jimp';
import Former from './../services/Former.js';
import internal from 'node:stream';
export default class {
	nut: Nut;
	private former: Former;
	wsDuplex: internal.Duplex;
	constructor({
		nut,
		former,
		wsDuplex,
	}: {
		nut: Nut;
		former: Former;
		wsDuplex: internal.Duplex;
	}) {
		this.nut = nut;
		this.former = former;
		this.wsDuplex = wsDuplex;
	}

	public handler = async (msg: WebSocket.RawData): Promise<void> => {
		const strMsg = msg.toString();
		console.log(strMsg);
		const [method, action, ...strValues] = strMsg.split(
			/[_ ]/
		) as HandlerTuple;
		const intValues: number[] = strValues.map((strValue) =>
			parseInt(strValue)
		);
		try {
			const result = await this?.[method](action, intValues);
			this.wsDuplex.write(`${method}_${action} ${result ?? strValues}`);
		} catch (err) {
			console.error(err);
		}
	};
	private draw = async (figure: Actions, values: number[]): Promise<void> => {
		try {
			const mousePosition = await this.nut.mouse.getPosition();
			const formResult: FormResult = this.former[figure]({
				values,
				mousePosition,
			});
			await this.nut.mouse.pressButton(Button.LEFT);
			await this[formResult.type](formResult[figure]);
			await this.nut.mouse.releaseButton(Button.LEFT);
		} catch (err) {
			console.error(err);
		}
	};
	private mouse = async (
		action: Actions,
		[value]: number[] = []
	): Promise<void | string> => {
		const { mouse } = this.nut;
		try {
			if (action === 'position') {
				const { x, y } = await mouse.getPosition();
				return `${x},${y}`;
			} else {
				await this.nut.mouse.move(this.nut[action](value));
				return `${value}`;
			}
		} catch (err) {
			console.error(err);
		}
	};

	private prnt = async (): Promise<void> => {
		const imageName = 'nut-capture';
		const pathToScreen = join(process.cwd(), '/assets');
		try {
			const { x, y } = await this.nut.mouse.getPosition();
			await screen.capture(imageName, FileType.PNG, pathToScreen);
			const screenshot = await Jimp.read(
				join(pathToScreen, imageName + '.png')
			);
			screenshot.crop(x, y, 200, 200);
			screenshot.writeAsync(
				join(pathToScreen, `crop-${imageName}${FileType.PNG}`)
			);
			const screenBuffer = await screenshot.getBufferAsync(Jimp.MIME_PNG);

			const screenBase64 = screenBuffer.toString('base64');

			this.wsDuplex.write(`prnt_scrn ${screenBase64}`);
			// -------------->>> LIBRARY BUG WItH MAC OS 13+ | ONLY SAVE SCREEN IMPLEMENTATION IS POSSIBLE;
			// const img = await screen.grabRegion(new Region(x - 100 < 0 ? 0 : x - 100, y - 100 < 0 ? 0 : y - 100, 200, 200));
			// const imgRGB = await img.toRGB();
			// const imgJimp = new Jimp({
			// 	data: Buffer.from(imgRGB.data),
			// 	width: imgRGB.width,
			// 	height: imgRGB.height,
			// });
			// const base64img = await jimpImg.getBase64Async(Jimp.MIME_PNG);
			// this.wsDuplex.send(`prnt_scrn ${base64img}`);
		} catch (err) {
			console.error(err);
		}
	};

	private points = async (form: Point[]): Promise<void> => {
		for (const point of form) {
			await this.nut.mouse.move(this.nut.straightTo(point));
		}
	};
	private moves = async (form: Move[]): Promise<void> => {
		for (const [dir, value] of form) {
			await this.nut.mouse.move(this.nut[dir](value));
		}
	};
}

export type FormResult = {
	type: Render;
	circle?: Point[];
	rectangle?: Move[];
	square?: Move[];
};
type Render = 'moves' | 'points';
export type FigureParams = { values: number[]; mousePosition: Point };
export type Move = [Directions, number];
type HandlerTuple = [Methods, Actions, ...string[]];
type Actions = Directions | Figures | 'position';
export type Directions = 'up' | 'down' | 'left' | 'right';
type Figures = 'rectangle' | 'square' | 'circle';
type Methods = 'mouse' | 'draw' | 'prnt';
