import { BULLET_SPEED, GUN_DMG, colors } from '../constants/constants'
import { k } from '../constants/k'
import { updateToolbar } from './updateToolbar'

export function initGuns({ guns, levels, game, toolbar }) {
	guns.removeAll()
	if (levels.gun <= 0) return

	const rate = levels.gun >= 3 ? 1 / (levels.gun - 1) : 1
	const gun = guns.add([k.pos(60, 0), k.sprite('gun'), k.anchor('center'), k.timer()])

	gun.loop(rate, () => {
		game.add([
			k.rect(24, 8, { radius: 2 }),
			k.outline(4, colors.black),
			k.pos(gun.worldPos().add(16, -8)),
			k.move(k.RIGHT, BULLET_SPEED),
			k.color(colors.grey),
			k.lifespan(10),
			k.area(),
			'bullet',
			{ dmg: GUN_DMG },
		])
	})

	// TODO: clean
	if (levels.gun >= 2) {
		const gun = guns.add([
			k.pos(-60, 0),
			k.sprite('gun', { flipX: true }),
			k.anchor('center'),
			k.timer(),
		])

		gun.loop(rate, () => {
			game.add([
				k.rect(24, 8, { radius: 2 }),
				k.outline(4, colors.black),
				k.pos(gun.worldPos().add(-16, -8)),
				k.move(k.LEFT, BULLET_SPEED),
				k.color(colors.grey),
				k.lifespan(10),
				k.area(),
				'bullet',
				{ dmg: GUN_DMG },
			])
		})
	}

	updateToolbar({ levels, toolbar })
}
