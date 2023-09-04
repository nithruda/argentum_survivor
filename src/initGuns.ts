import { BULLET_SPEED, GUN_DMG, colors } from '../constants/constants'
import { k } from '../constants/k'
import { updateToolbar } from './updateToolbar'

export function initGuns({ guns, levels, game, toolbar }) {
	try {
		const {
			pos,
			sprite,
			timer,
			rect,
			outline,
			move,
			color,
			anchor,
			area,
			lifespan,
			play,
			RIGHT,
			LEFT,
		} = k

		guns.removeAll()
		if (levels.gun <= 0) return

		const rate = levels.gun >= 3 ? 1 / (levels.gun - 1) : 1
		const gun = guns.add([pos(60, 0), sprite('gun'), anchor('center'), timer()])

		gun.loop(rate, () => {
			game.add([
				rect(24, 8, { radius: 2 }),
				outline(4, colors.black),
				pos(gun.worldPos().add(16, -8)),
				move(RIGHT, BULLET_SPEED),
				color(colors.grey),
				lifespan(10),
				area(),
				'bullet',
				{ dmg: GUN_DMG },
			])
			play('2', {
				detune: k.rand(-200, 200),
			})
		})

		// TODO: clean
		if (levels.gun >= 2) {
			const gun = guns.add([
				pos(-60, 0),
				sprite('gun', { flipX: true }),
				anchor('center'),
				timer(),
			])

			gun.loop(rate, () => {
				game.add([
					rect(24, 8, { radius: 2 }),
					outline(4, colors.black),
					pos(gun.worldPos().add(-16, -8)),
					move(LEFT, BULLET_SPEED),
					color(colors.grey),
					lifespan(10),
					area(),
					'bullet',
					{ dmg: GUN_DMG },
				])
				play('2')
			})
		}

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init guns', error)
	}
}
