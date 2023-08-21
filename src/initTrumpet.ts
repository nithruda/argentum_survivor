import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { highlight } from './highlight'
import { updateToolbar } from './updateToolbar'

export function initTrumpet({ trumpets, levels, game, bean, toolbar }) {
	trumpets.removeAll()
	if (levels.trumpet <= 0) return

	const trumpet = trumpets.add([
		k.pos(0, 0),
		k.sprite('trumpet'),
		k.timer(),
		k.scale(),
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
		k.play('horn')
		const effect = bean.add([
			k.circle(0),
			k.timer(),
			k.opacity(0.3),
			k.color(),
			k.z(-100),
		])
		effect.onUpdate(() => {
			const c1 = colors.lightblue
			const c2 = colors.green
			const s = 16
			effect.color.r = k.wave(c1.r, c2.r, k.time() * s)
			effect.color.g = k.wave(c1.g, c2.g, k.time() * s)
			effect.color.b = k.wave(c1.b, c2.b, k.time() * s)
		})
		effect.tween(0, 300, 1, r => (effect.radius = r))
		effect.tween(1, 0, 1, o => (effect.opacity = o))
		effect.wait(1, () => effect.destroy())
	})

	updateToolbar({ levels, toolbar })
}
