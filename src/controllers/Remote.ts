import WebSocket from 'ws';
import { Button, FileType, Point, Region, screen } from '@nut-tree/nut-js';
import { Nut } from '../index.js';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import Jimp from 'jimp';
import Former from './../services/Former.js';
import internal from 'node:stream';
export default class {
	nut: Nut;
	ws: WebSocket;
	former: Former;
	wsDuplex: internal.Duplex;
	constructor({
		nut,
		ws,
		former,
		wsDuplex,
	}: {
		nut: Nut;
		ws: WebSocket;
		former: Former;
		wsDuplex: internal.Duplex;
	}) {
		this.nut = nut;
		this.ws = ws;
		this.former = former;
		this.wsDuplex = wsDuplex;
	}

	public handler = async (msg: WebSocket.RawData): Promise<void> => {
		const strMsg = msg.toString();
		const [method, action, ...strValues] = strMsg.split(
			/[_ ]/
		) as HandlerTuple;
		const intValues: number[] = strValues.map((strValue) =>
			parseInt(strValue)
		);
		try {
			const result = await this?.[method](action, intValues);
			const strResult = `${method}_${action} ${result ?? strValues}`;
			this.ws.send(strResult);
			console.log(strResult);
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
			// const grab = await this.nut.screen.grabRegion(
			// 	new Region(50, 50, 100, 100)
			// );
			// this.ws.send(`prnt_scrn ${''}`);
			// console.log(grab);
			const { x, y } = await this.nut.mouse.getPosition();
			// const img = await screen.grabRegion(new Region(x, y, 100, 100));
			// await screen.capture(imageName, FileType.PNG, pathToScreen);
			const rawData = readFileSync(
				join(pathToScreen, imageName + '.png'),
				'utf-8'
			);
			const image = await Jimp.read(Buffer.from(rawData, 'base64'));
			console.log(image);
			// const base64img = await jimpImg.getBase64Async(Jimp.MIME_PNG);

			// this.ws.send(`prnt_scrn ${base64img}`);

			// const imgRGB = await img.toRGB();
			// console.log(imgRGB);
			// const imgJimp = new Jimp({
			// 	data: Buffer.from(imgRGB.data),
			// 	width: imgRGB.width,
			// 	height: imgRGB.height,
			// });
			// console.log(imgJimp);

			// await screen.capture(imageName, FileType.PNG, pathToScreen);
			// const image = await Jimp.read(
			// 	join(pathToScreen, imageName + '.png')
			// );

			// image.crop(
			// 	x - 100 < 0 ? 0 : x - 100,
			// 	y - 100 < 0 ? 0 : y - 100,
			// 	200,
			// 	200
			// );
			// await image.writeAsync(
			// 	join(pathToScreen, 'crop-' + imageName + '.png')
			// );
			// const buffImage = await image.getBufferAsync(Jimp.MIME_PNG);
			// // const strImage = await image.getBase64Async(Jimp.MIME_PNG);
			// const cropImage = await Jimp.read(
			// 	join(pathToScreen, 'crop-' + imageName + '.png')
			// );

			// const buffCrop = await cropImage.getBufferAsync(Jimp.MIME_PNG);
			// const body = []
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
