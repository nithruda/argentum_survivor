import { k } from '../constants/k'

// Make a transparent black filter
export function makeFilter() {
	return k.make([
		k.rect(k.width(), k.height()),
		k.color(0, 0, 0),
		k.opacity(0.7),
		k.fixed(),
	])
}
