import Shape, { InitialShapeTuple, Sizes } from './Shape.js';

class Rectangle extends Shape {
	constructor(defaultRect: InitialShapeTuple) {
		super(defaultRect);
	}
	public getPerimeter = (): number =>
		(this.sizes[Sizes.width] + this.sizes[Sizes.height]) * 2;
	public getArea = (): number =>
		this.sizes[Sizes.width] * this.sizes[Sizes.height];
}
export default Rectangle;
