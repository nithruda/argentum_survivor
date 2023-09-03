import { BoomOpt, GameObj } from 'kaboom'

import { k } from '../constants/k'

export const addKaboom = (p, opt: BoomOpt = {}): GameObj => {
	const { add, pos, stay, sprite, scale, anchor, timer } = k
	const kaboom = add([pos(p), stay()])

	const flash = kaboom.add([sprite('flash'), scale(2), anchor('center'), timer()])
	flash.play('flash')

	flash.wait(0.35, () => {
		flash.destroy()
	})

	return kaboom
}
