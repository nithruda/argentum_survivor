import { colors } from '../constants/constants'
import { k } from '../constants/k'
import { initGame } from './initGame'
import { makeFilter } from './makeFilter'

export function initTitle({ music }) {
  music.paused = true
  music = k.play('music', { loop: true })
  const scene = k.add([])
  scene.add(makeFilter())

  const title = scene.add([
    k.fixed(),
    k.z(200),
    k.anchor('center'),
    k.pos(k.center().add(0, -60)),
    k.sprite('title', { width: k.width() * 0.7 }),
    k.scale(1),
  ])

  title.onUpdate(() => {
    title.scaleTo(k.wave(1, 1.05, k.time() * 3))
  })

  const text = k.make([
    k.text('Press space or click to start', { size: 24 }),
    k.anchor('center'),
    k.fixed(),
    k.opacity(),
  ])

  const box = scene.add([
    k.rect(text.width + 24, text.height + 24, { radius: 8 }),
    k.pos(k.center().add(0, 200)),
    k.anchor('center'),
    k.color(colors.black),
    k.fixed(),
    k.opacity(),
  ])

  box.onUpdate(() => {
    box.width = text.width + 24
    box.height = text.height + 24
    box.opacity = k.wave(0, 1, k.time() * 6)
    text.opacity = k.wave(0, 1, k.time() * 6)
  })

  box.add(text)
  const events = []
  scene.onDestroy(() => {
    events.forEach((ev) => ev.cancel())
  })

  events.push(
    k.onKeyPress('space', () => {
      scene.destroy()
      initGame({ music })
    })
  )

  events.push(
    k.onClick(() => {
      scene.destroy()
      initGame({ music })
    })
  )

  return scene
}
