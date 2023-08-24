import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { initGame } from './initGame'
import { makeFilter } from './makeFilter'

export function initGameOver({ music }) {
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

		const titleBackground = scene.add([
			fixed(),
			z(0),
			anchor('center'),
			pos(center().add(0, -60)),
			sprite('background', { width: width() }),
			scale(1),
		])

		titleBackground.onUpdate(() => {
			titleBackground.scaleTo(wave(1, 1.01, time() * 3))
		})

		const titleText = make([
			text('Game Over', { size: 70 }),
			anchor('center'),
			fixed(),
			opacity(),
		])

		const subTitleText = make([
			text('Press space or click to start again', { size: 24 }),
			anchor('center'),
			fixed(),
			opacity(),
		])

		const titleBox = scene.add([
			rect(titleText.width + 24, titleText.height + 24, { radius: 8 }),
			pos(center().add(0, -200)),
			anchor('center'),
			color(colors.black),
			fixed(),
			opacity(0.8),
		])

		const subTitleBox = scene.add([
			rect(subTitleText.width + 24, subTitleText.height + 24, { radius: 8 }),
			pos(center().add(0, 200)),
			anchor('center'),
			color(colors.black),
			fixed(),
			opacity(),
		])

		titleBox.onUpdate(() => {
			titleBox.width = subTitleText.width + 440
			titleBox.height = subTitleText.height + 75
		})

		subTitleBox.onUpdate(() => {
			subTitleBox.width = subTitleText.width + 24
			subTitleBox.height = subTitleText.height + 24
			subTitleBox.opacity = wave(0, 1, time() * 6)
			subTitleText.opacity = wave(0, 1, time() * 6)
		})

		titleBox.add(titleText)
		subTitleBox.add(subTitleText)
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
		throw new Error('Something went wrong while trying to init game over', error)
	}
}
