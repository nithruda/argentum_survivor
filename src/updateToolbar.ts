import { colors } from '../constants/constants'
import { k } from '../constants/k'

export function updateToolbar({ levels, toolbar }) {
	try {
		const { sprite, anchor, scale, pos, fixed, circle, color, text } = k
		toolbar.removeAll()
		let x = 36

		for (const tool in levels) {
			const level = levels[tool]
			if (level <= 0) continue
			toolbar.add([sprite(tool), pos(x, -38), fixed(), anchor('center'), scale(1.5)])
			const dot = toolbar.add([
				circle(12),
				fixed(),
				pos(x + 22, -24),
				anchor('center'),
				color(colors.black),
			])
			dot.add([text(level, { size: 16 }), fixed(), anchor('center')])
			x += 64
		}
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to update the toolbar', error)
	}
}
