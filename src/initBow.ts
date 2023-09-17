import { ARROW_SPEED, BOW_DMG } from '../constants/constants'
import { k } from '../constants/k'
import { updateToolbar } from './updateToolbar'

export function initBow({ bows, levels, game, toolbar }) {
	try {
		const {
			pos,
			sprite,
			timer,
			move,
			anchor,
			area,
			lifespan,
			play,
			rotate,
			RIGHT,
			LEFT,
		} = k

		bows.removeAll()
		if (levels.bow <= 0) return

		const rate = levels.bow >= 3 ? 1 / (levels.bow - 1) : 1
		const bow = bows.add([
			pos(25, -20),
			sprite('bow'),
			anchor('center'),
			rotate(0),
			timer(),
		])

		bow.loop(rate, () => {
			game.add([
				sprite('arrow'),
				pos(bow.worldPos().add(16, -8)),
				move(RIGHT, ARROW_SPEED),
				lifespan(10),
				area(),
				rotate(0),
				'arrow',
				{ dmg: BOW_DMG },
			])
			play('2', {
				detune: k.rand(-200, 200),
			})
		})

		// TODO: clean
		if (levels.bow >= 2) {
			const bow = bows.add([
				pos(-25, -20),
				sprite('bow', { flipX: true }),
				anchor('center'),
				rotate(0),
				timer(),
			])

			bow.loop(rate, () => {
				game.add([
					sprite('arrow'),
					pos(bow.worldPos().add(0, 0)),
					move(LEFT, ARROW_SPEED),
					lifespan(10),
					rotate(0),
					area(),
					'arrow',
					{ dmg: BOW_DMG },
				])
				play('2')
			})
		}

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init bows', error)
	}
}
