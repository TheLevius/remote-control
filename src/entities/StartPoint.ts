export default class {
	startPoint: Point;
	constructor(x = 0, y = 0) {
		this.startPoint = [x, y];
	}

	public getStartPoint = (): Point => this.startPoint;

	public setStartPoints = (
		x: number = this.startPoint[Dimensions.X],
		y: number = this.startPoint[Dimensions.Y]
	): Point => {
		this.setStartXValue(x);
		this.setStartYValue(y);
		return this.startPoint;
	};

	public setStartXValue = (value: number): number =>
		this._setStartValue(value, Dimensions.X);

	public setStartYValue = (value: number): number =>
		this._setStartValue(value, Dimensions.Y);

	_setStartValue = (value: number, dimension: Dimensions): number => {
		this.startPoint[dimension] = value ?? this.startPoint[dimension];
		return this.startPoint[dimension];
	};
}
export type Point = [number, number];
export const enum Dimensions {
	X = 0,
	Y = 1,
}
