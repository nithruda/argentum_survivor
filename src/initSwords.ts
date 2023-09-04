import { MAX_SWORDS, SWORD_DMG, SWORD_SPEED } from '../constants/constants'
import { k } from '../constants/k'
import { updateToolbar } from './updateToolbar'

export // Add swords mechanics
function initSwords({ swords, levels, toolbar }) {
	try {
		const { rotate, pos, sprite, area, Rect, rand, vec2, play, anchor } = k

		swords.removeAll()
		if (levels.sword <= 0) return

		const numSwords = Math.min(levels.sword, MAX_SWORDS)
		const interval = 360 / numSwords

		for (let i = 0; i < numSwords; i++) {
			// Use another indirect parent game object to manage the swords position to the center
			const center = swords.add([rotate(i * interval)])
			const sword = center.add([
				pos(0, -70),
				sprite('sword'),
				anchor('center'),
				area({ shape: new Rect(vec2(0, -10), 5, 40) }),
				{ dmg: SWORD_DMG },
			])

			sword.onCollide('enemy', enemy => {
				play('13', {
					// Randomly detune the sound effect to add some variation when multiple happening sequentially
					detune: rand(-300, 300),
				})
				enemy.hurt(sword.dmg)
			})
		}

		// When level is more than 4, we increase the rotate speed
		if (levels.sword >= 4) {
			swords.speed = SWORD_SPEED * (levels.sword - 2)
		}

		updateToolbar({ levels, toolbar })
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init swords', error)
	}
}
