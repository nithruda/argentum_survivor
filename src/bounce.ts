import { GameObj, ScaleComp, TimerComp } from 'kaboom'

import { k } from '../constants/k'

export function bounce(
  opts: {
    to?: number
    keep?: boolean
  } = {}
) {
  let timer = 0
  const speed = 10
  const to = opts.to || 1
  return {
    id: 'bounce',
    require: ['scale'],
    async add(this: GameObj<ScaleComp | TimerComp>) {
      // TODO: easier to use timer tied to game object
      this.use(k.timer())
      this.scaleTo(0, 0)
      await this.tween(
        0,
        to,
        1,
        (s) => this.scaleTo(s),
        k.easings.easeOutElastic
      )
      if (opts.keep) {
        this.onUpdate(() => {
          this.scaleTo(k.wave(to, to * 1.2, timer * speed, (t) => -Math.cos(t)))
          timer += k.dt()
        })
      }
    },
  }
}
