import { GameObj, ScaleComp } from 'kaboom'

import { k } from '../constants/k'

export function highlight(
	opts: {
		speed?: number
		scale?: number
	} = {}
) {
	let highlighting = false
	let timer = 0
	const speed = opts.speed || 10
	const scale = opts.scale || 1.5
	const cycle = (Math.PI / speed) * 2
	return {
		require: ['scale'],
		highlight() {
			highlighting = true
			timer = 0
		},
		update(this: GameObj<ScaleComp>) {
			if (!highlighting) return
			timer += k.dt()
			this.scaleTo(k.wave(1, scale, timer * speed, t => -Math.cos(t)))

			if (timer >= cycle) {
				highlighting = false
				this.scaleTo(1)
			}
		},
	}
}
