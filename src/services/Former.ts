import { Point } from '@nut-tree/nut-js';
import { Directions, FigureParams, Move } from '../controllers/Remote.js';

export default class {
	rectDrawOrder: Directions[];
	constructor() {
		this.rectDrawOrder = ['right', 'down', 'left', 'up'];
	}
	public square = ({
		values: [size],
	}: FigureParams): { type: 'moves'; square: Move[] } => {
		const moves: Move[] = this.rectDrawOrder.map((dir) => [dir, size]);
		return { type: 'moves', square: moves };
	};

	public rectangle = ({
		values: [width, height],
	}: FigureParams): { type: 'moves'; rectangle: Move[] } => {
		const moves: Move[] = this.rectDrawOrder.map((dir, i) => [
			dir,
			i % 2 === 0 ? width : height,
		]);
		return { type: 'moves', rectangle: moves };
	};

	public circle = ({
		values,
		mousePosition,
	}: FigureParams): { type: 'points'; circle: Point[] } => {
		const [radius] = values;
		const { x: offsetX, y: offsetY } = mousePosition;
		const diameter = radius * 2;
		const tripleRadius = radius * 3;
		const multiplier = Math.PI / diameter;

		const calcX = (i: number): number =>
			Math.round(radius * Math.cos(multiplier * i));
		const calcY = (i: number): number =>
			Math.round(radius * Math.sin(multiplier * i));
		const points: Point[] = new Array(radius * 4);

		for (let i = -radius; i <= tripleRadius; i++) {
			points[i + radius] = new Point(
				offsetX + calcX(i),
				offsetY + radius + calcY(i)
			);
		}
		return { type: 'points', circle: points };
	};
}
