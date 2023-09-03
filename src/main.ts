import {
	HEIGHT,
	TILE_HEIGHT,
	TILE_WIDTH,
	WIDTH,
	aseprites,
	sounds,
	sprites,
	images,
	fonts,
} from '../constants/constants'
import { k } from '../constants/k'
import { initTitle } from './initTitle'

const {
	BLACK,
	volume,
	setBackground,
	loadSprite,
	loadSpriteAtlas,
	loadAseprite,
	add,
	play,
	pos,
	loadSound,
	randi,
	sprite,
	loadFont,
} = k

volume(0.5)
setBackground(BLACK)

for (const spr of sprites) {
	k.loadSprite(spr, `sprites/${spr}.png`)
}

loadSpriteAtlas(`sprites/human.png`, {
	human: {
		x: 0,
		y: 0,
		width: 135,
		height: 191,
		sliceX: 5,
		sliceY: 4,
		anims: {
			idleDown: { from: 0, to: 0 },
			idleUp: { from: 5, to: 5 },
			idleLeft: { from: 11, to: 11 },
			idleRight: { from: 16, to: 16 },
			walkDown: { from: 0, to: 4, speed: 14, loop: true },
			walkUp: { from: 5, to: 9, speed: 14, loop: true },
			walkLeft: { from: 10, to: 14, speed: 14, loop: true },
			walkRight: { from: 15, to: 19, speed: 14, loop: true },
		},
	},
})

loadSpriteAtlas(`sprites/skeleton.png`, {
	skeleton: {
		x: 0,
		y: 0,
		width: 256,
		height: 256,
		sliceX: 8,
		sliceY: 5,
		anims: {
			idleDown: { from: 0, to: 0 },
			idleUp: { from: 9, to: 9 },
			idleLeft: { from: 12, to: 12 },
			idleRight: { from: 16, to: 16 },
			walkDown: { from: 0, to: 7, speed: 14, loop: true },
			walkUp: { from: 10, to: 15, speed: 14, loop: true },
			walkLeft: { from: 16, to: 23, speed: 14, loop: true },
			walkRight: { from: 24, to: 31, speed: 14, loop: true },
		},
	},
})

loadSpriteAtlas(`sprites/spider.png`, {
	spider: {
		x: 0,
		y: 0,
		width: 795,
		height: 528,
		sliceX: 5,
		sliceY: 4,
		anims: {
			idleDown: { from: 0, to: 0 },
			idleUp: { from: 5, to: 5 },
			idleLeft: { from: 11, to: 11 },
			idleRight: { from: 16, to: 16 },
			walkDown: { from: 0, to: 4, speed: 14, loop: true },
			walkUp: { from: 5, to: 9, speed: 14, loop: true },
			walkLeft: { from: 10, to: 14, speed: 14, loop: true },
			walkRight: { from: 15, to: 19, speed: 14, loop: true },
		},
	},
})

loadSpriteAtlas(`sprites/skeletonWizard.png`, {
	skeletonWizard: {
		x: 0,
		y: 0,
		width: 217,
		height: 207,
		sliceX: 8,
		sliceY: 4,
		anims: {
			idleDown: { from: 0, to: 0 },
			idleUp: { from: 8, to: 8 },
			idleLeft: { from: 16, to: 16 },
			idleRight: { from: 24, to: 24 },
			walkDown: { from: 0, to: 7, speed: 14, loop: true },
			walkUp: { from: 8, to: 15, speed: 14, loop: true },
			walkLeft: { from: 15, to: 19, speed: 14, loop: true },
			walkRight: { from: 20, to: 27, speed: 14, loop: true },
		},
	},
})

loadSpriteAtlas(`sprites/flash.png`, {
	flash: {
		x: 0,
		y: 0,
		width: 119,
		height: 17,
		sliceX: 8,
		sliceY: 1,
		anims: {
			flash: { from: 0, to: 8, speed: 14, loop: true },
		},
	},
})

for (const img of images) {
	loadSprite(img, `images/${img}.png`)
}

for (const aspr of aseprites) {
	loadAseprite(aspr, `sprites/${aspr}.png`, `sprites/${aspr}.json`)
}

for (const font of fonts) {
	loadFont(font, `fonts/${font}.ttf`)
}

for (const sound of sounds) {
	loadSound(sound, `sounds/${sound}.mp3`)
}

const music = play('music', {
	loop: true,
})

// Add the background tiles
for (let i = 0; i < WIDTH / TILE_WIDTH; i++) {
	for (let j = 0; j < HEIGHT / TILE_HEIGHT; j++) {
		add([
			pos(j * TILE_WIDTH, i * TILE_HEIGHT),
			sprite('field', {
				width: 190,
				height: 190,
				frame: randi(0, 4),
			}),
		])
	}
}

initTitle({ music })
