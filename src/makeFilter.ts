import { k } from '../constants/k'

// Make a transparent black filter
export function makeFilter() {
	try {
		const { make, width, height, fixed, opacity, color, rect } = k

		return make([rect(width(), height()), color(0, 0, 0), opacity(0.7), fixed()])
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to make filter', error)
	}
}
