import { STAFF_DMG, colors } from '../constants/constants'
import { k } from '../constants/k'
import { highlight } from './highlight'
import { updateToolbar } from './updateToolbar'

export function initStaff({ staffs, levels, game, player, toolbar }) {
	try {
		const {
			pos,
			sprite,
			timer,
			scale,
			play,
			circle,
			wave,
			z,
			time,
			opacity,
			color,
			rotate,
			rand,
			area,
		} = k

		staffs.removeAll()
		if (levels.staff <= 0) return

		const staff = staffs.add([
			pos(-20, -35),
			sprite('staff'),
			timer(),
			scale(),
			rotate(15),
			highlight(),
			area(),
			{ dmg: STAFF_DMG },
		])

		staff.loop(3, async () => {
			const enemies = game.get('enemy')
			for (const enemy of enemies) {
				if (enemy.pos.dist(player.pos) <= 240) {
					enemy.enterState('dizzy')
				}
			}

			staff.highlight()
			play('19')
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

			staff.onCollide('enemy', enemy => {
				play('13', {
					detune: rand(-300, 300),
				})
				enemy.hurt(staff.dmg)
			})
		})

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init staff', error)
	}
}
