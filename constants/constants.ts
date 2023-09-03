import { k } from './k'

const { rgb, LEFT, RIGHT, UP, DOWN } = k

export const SPEED = 320
export const WIDTH = 1920
export const HEIGHT = 1920
export const TILE_WIDTH = 190
export const TILE_HEIGHT = 190
export const MAX_HP = 100
export const HP_BAR_WIDTH = 200
export const EXP_BAR_WIDTH = 200
export const SWORD_SPEED = 80
export const MAX_SWORDS = 3
export const BULLET_SPEED = 800
export const SKELETON_WIZARD_BULLET_SPEED = 400
export const SPIDER_SPEED = 300
export const SKELETON_WIZARD_SPEED = 80
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
	'apple',
	'giant',
	'hpBar',
	'expBar',
	'toolbar',
	'sword',
	'gun',
	'trumpet',
	'!',
]

export const aseprites = ['field']

export const sounds = [
	'music2',
	'music',
	'sword',
	'wooosh',
	'shoot',
	'spring',
	'off',
	'powerUp',
	'mystic',
	'error',
	'horn',
]

export const wavs = [
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'30',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
	'39',
	'40',
	'41',
	'42',
	'43',
	'44',
	'45',
	'46',
	'47',
	'48',
	'49',
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

export const fonts = ['alegreya', 'cardo', 'livvic']

export const images = ['background']
