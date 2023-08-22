import { k } from './k'

const { rgb, LEFT, RIGHT, UP, DOWN } = k

export const SPEED = 320
export const WIDTH = 1920
export const HEIGHT = 1920
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 64
export const MAX_HP = 100
export const HP_BAR_WIDTH = 200
export const EXP_BAR_WIDTH = 200
export const SWORD_SPEED = 80
export const MAX_SWORDS = 3
export const BULLET_SPEED = 800
export const DINO_BULLET_SPEED = 400
export const BUTTERFLY_SPEED = 300
export const DINO_SPEED = 80
export const GIANT_SPEED = 200
export const BAG_SPEED = 60
export const SWORD_DMG = 150
export const GUN_DMG = 100
export const DIZZY_SPEED = 1000
export const MAX_EXP_INIT = 10
export const MAX_EXP_STEP = 5
export const BOSS_MARK = 3000
export const BOSS_MARK_STEP = 3000
export const TOUCH_SPEED = 40

export const colors = {
	red: rgb(204, 66, 94),
	green: rgb(91, 166, 117),
	orange: rgb(255, 184, 121),
	black: rgb(31, 16, 42),
	blue: rgb(109, 128, 250),
	lightblue: rgb(141, 183, 255),
	grey: rgb(166, 133, 159),
}

export const sprites = [
	'title',
	'bean',
	'bag',
	'dino',
	'butterfly',
	'giant',
	'hpBar',
	'expBar',
	'toolbar',
	'sword',
	'gun',
	'heart',
	'trumpet',
	'!',
]

export const aseprites = ['field']

export const sounds = [
	'music',
	'music2',
	'sword',
	'wooosh',
	'shoot',
	'spring',
	'off',
	'alarm',
	'powerUp',
	'mystic',
	'error',
	'horn',
]

export const dirs = {
	left: LEFT,
	right: RIGHT,
	up: UP,
	down: DOWN,
	w: UP,
	a: LEFT,
	s: DOWN,
	d: RIGHT,
}
