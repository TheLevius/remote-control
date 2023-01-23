import StartPoint, { Dimensions, Point } from './StartPoint.js';
class Shape extends StartPoint {
	startPoint: Point;
	sizes: DimensionDiffs;
	constructor(defaultShape: InitialShapeTuple = defaultShapeTuple) {
		const [x, y, width, height] = defaultShape ?? defaultShapeTuple;
		super(x, y);
		this.startPoint = [x ?? 0, y ?? 0];
		this.sizes = [width ?? 0, height ?? 0];
	}
	public setSizes = (values: DimensionDiffs) => {
		this.setWidthSize(values[Sizes.width]);
		this.setHeightSize(values[Sizes.height]);
		return this.sizes;
	};
	public setWidthSize = (newValue: number): number =>
		this._setSize(newValue, Sizes.width);

	public setHeightSize = (newValue: number): number =>
		this._setSize(newValue, Sizes.height);

	_setSize = (newValue: number, sizeType: Sizes) => {
		this.sizes[sizeType] = newValue ?? this.sizes[sizeType];
		return this.sizes[sizeType];
	};

	public getEndingPoint = (): [number, number] => [
		this.getXEndingDimensionValue(),
		this.getYEndingDimensionValue(),
	];

	public getXEndingDimensionValue = (): number =>
		this._getEndingDimensionValue(Dimensions.X);

	public getYEndingDimensionValue = (): number =>
		this._getEndingDimensionValue(Dimensions.X);

	_getEndingDimensionValue = (dimension: Dimensions): number =>
		this.startPoint[dimension] + this.sizes[dimension];

	_getSizeValues = (): DimensionDiffs => this.sizes;
	_getSizeValue = (sizeType: Sizes): Sizes => this.sizes[sizeType];
}

export type InitialShapeTuple = [number, number, number, number];
export type DimensionDiffs = [number, number];
const defaultShapeTuple: InitialShapeTuple = [0, 0, 0, 0];

export const enum Sizes {
	width = 0,
	height = 1,
}
export default Shape;
