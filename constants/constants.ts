import { k } from './k'

const { rgb, LEFT, RIGHT, UP, DOWN } = k

export const SPEED = 320
export const WIDTH = 1920
export const HEIGHT = 1920
export const TILE_WIDTH = 190
export const TILE_HEIGHT = 190
export const MAX_HP = 100
export const MAX_MANA = 100
export const HP_BAR_WIDTH = 200
export const EXP_BAR_WIDTH = 200
export const SWORD_SPEED = 80
export const MAX_SWORDS = 3
export const ARROW_SPEED = 800
export const SKELETON_WIZARD_ARROW_SPEED = 400
export const SPIDER_SPEED = 300
export const SKELETON_WIZARD_SPEED = 80
export const GIANT_SPEED = 200
export const BAG_SPEED = 60
export const SWORD_DMG = 150
export const BOW_DMG = 100
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
	'giant',
	'hpBar',
	'expBar',
	'toolbar',
	'sword',
	'sword2',
	'sword3',
	'bow',
	'bow2',
	'staff',
	'staff2',
	'staff3',
	'!',
]

export const aseprites = ['field']

export const sounds = [
	'music',
	'music2',
	'2',
	'6',
	'10',
	'11',
	'13',
	'16',
	'19',
	'69',
	'135',
	'251',
	'2036',
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
