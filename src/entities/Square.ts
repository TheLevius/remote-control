import Shape, { Sizes } from './Shape.js';

class Square extends Shape {
	constructor([x, y, width]: DefaultSquareTuple = [0, 0, 0]) {
		super([x ?? 0, y ?? 0, width ?? 0, width ?? 0]);
	}
	_setSize = (newValue: number) => {
		const value = newValue ?? this.sizes[Sizes.width];
		this.sizes[Sizes.width] = value;
		this.sizes[Sizes.height] = value;
		return this.sizes[Sizes.width];
	};
}
type DefaultSquareTuple = [number, number, number];
export default Square;
