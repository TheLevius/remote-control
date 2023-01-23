import { Point } from './StartPoint.js';
import { Sizes } from './Shape.js';
import Square from './Square.js';
import { Dimensions } from './StartPoint.js';

class Circle extends Square {
	constructor([x, y, radius]: InitialCircleTuple = [0, 0, 0]) {
		x = x ?? 0;
		y = y ?? 0;
		radius = radius ?? 0;
		super([x, y, radius * 2]);
	}
	get radius(): number {
		return this.sizes[Sizes.width] !== 0 ? this.sizes[Sizes.width] / 2 : 0;
	}
	get center(): Point {
		const radius = this.radius;
		return [
			this.startPoint[Dimensions.X] + radius,
			this.startPoint[Dimensions.Y] + radius,
		];
	}
	_setRadius = (value: number): number => {
		this._setSize(value * 2);
		return this.radius;
	};
	public getDiameter = () => this.sizes[Sizes.width];
	public getArea = () => Math.PI * this.radius ** 2;
	public getPerimeter = () => Math.PI * (this.radius * 2);
}

type InitialCircleTuple = [number, number, number];

export default Circle;
