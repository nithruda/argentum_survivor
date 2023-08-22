import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { highlight } from './highlight'
import { updateToolbar } from './updateToolbar'

export function initTrumpet({ trumpets, levels, game, bean, toolbar }) {
	try {
		const { pos, sprite, timer, scale, play, circle, wave, z, time, opacity, color } = k

		trumpets.removeAll()
		if (levels.trumpet <= 0) return

		const trumpet = trumpets.add([
			pos(0, 0),
			sprite('trumpet'),
			timer(),
			scale(),
			highlight(),
		])

		trumpet.loop(3, async () => {
			// TODO: find all enemies within a radius
			for (const e of game.get('enemy')) {
				if (e.pos.dist(bean.pos) <= 240) {
					e.enterState('dizzy')
				}
			}
			trumpet.highlight()
			play('horn')
			const effect = bean.add([circle(0), timer(), opacity(0.3), color(), z(-100)])
			effect.onUpdate(() => {
				const c1 = colors.lightblue
				const c2 = colors.green
				const s = 16
				effect.color.r = wave(c1.r, c2.r, time() * s)
				effect.color.g = wave(c1.g, c2.g, time() * s)
				effect.color.b = wave(c1.b, c2.b, time() * s)
			})
			effect.tween(0, 300, 1, r => (effect.radius = r))
			effect.tween(1, 0, 1, o => (effect.opacity = o))
			effect.wait(1, () => effect.destroy())
		})

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init trumpet', error)
	}
}
