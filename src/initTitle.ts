import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { initGame } from './initGame'
import { makeFilter } from './makeFilter'

export function initTitle({ music }) {
	try {
		const {
			play,
			add,
			fixed,
			z,
			scale,
			sprite,
			width,
			center,
			anchor,
			pos,
			time,
			wave,
			opacity,
			rect,
			make,
			color,
			onKeyPress,
			onClick,
			text,
		} = k

		music.paused = true
		music = play('music', { loop: true })
		const scene = add([])
		scene.add(makeFilter())

		const title = scene.add([
			fixed(),
			z(200),
			anchor('center'),
			pos(center().add(0, -60)),
			sprite('title', { width: width() * 0.7 }),
			scale(1),
		])

		title.onUpdate(() => {
			title.scaleTo(wave(1, 1.05, time() * 3))
		})

		const titleText = make([
			text('Press space or click to start', { size: 24 }),
			anchor('center'),
			fixed(),
			opacity(),
		])

		const box = scene.add([
			rect(titleText.width + 24, titleText.height + 24, { radius: 8 }),
			pos(center().add(0, 200)),
			anchor('center'),
			color(colors.black),
			fixed(),
			opacity(),
		])

		box.onUpdate(() => {
			box.width = titleText.width + 24
			box.height = titleText.height + 24
			box.opacity = wave(0, 1, time() * 6)
			titleText.opacity = wave(0, 1, time() * 6)
		})

		box.add(titleText)
		const events = []
		scene.onDestroy(() => {
			events.forEach(ev => ev.cancel())
		})

		events.push(
			onKeyPress('space', () => {
				scene.destroy()
				initGame({ music })
			})
		)

		events.push(
			onClick(() => {
				scene.destroy()
				initGame({ music })
			})
		)

		return scene
	} catch (error) {
		console.error(error)
		throw new Error('Something went wrong while trying to init title', error)
	}
}
