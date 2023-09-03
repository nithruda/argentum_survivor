import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { highlight } from './highlight'
import { updateToolbar } from './updateToolbar'

export function initTrumpet({ trumpets, levels, game, player, toolbar }) {
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

		const enemies = game.get('enemy')

		trumpet.loop(3, async () => {
			// TODO: find all enemies within a radius
			for (const enemy of enemies) {
				if (enemy.pos.dist(player.pos) <= 240) {
					enemy.enterState('dizzy')
				}
			}

			trumpet.highlight()
			play('horn')
			const effect = player.add([circle(0), timer(), opacity(0.3), color(), z(-100)])
			effect.onUpdate(() => {
				const c1 = colors.lightblue
				const c2 = colors.green
				const s = 16
				effect.color.r = wave(c1.r, c2.r, time() * s)
				effect.color.g = wave(c1.g, c2.g, time() * s)
				effect.color.b = wave(c1.b, c2.b, time() * s)
			})
			effect.tween(0, 300, 1, radius => (effect.radius = radius))
			effect.tween(1, 0, 1, opacity => (effect.opacity = opacity))
			effect.wait(1, () => effect.destroy())
		})

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init trumpet', error)
	}
}