import { colors } from '../constants/constants'
import { k } from '../constants/k'

// Update the toolbar to reflect current levels. To make it easy we'll just
// remove everything and initialize items again.

export function updateToolbar({ levels, toolbar }) {
	try {
		toolbar.removeAll()
		let x = 36
		for (const tool in levels) {
			const level = levels[tool]
			if (level <= 0) continue
			toolbar.add([
				k.sprite(tool),
				k.pos(x, -38),
				k.fixed(),
				k.anchor('center'),
				k.scale(0.8),
			])
			const dot = toolbar.add([
				k.circle(12),
				k.fixed(),
				k.pos(x + 22, -24),
				k.anchor('center'),
				k.color(colors.black),
			])
			dot.add([k.text(level + '', { size: 16 }), k.fixed(), k.anchor('center')])
			x += 64
		}
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to update the toolbar', error)
	}
}
