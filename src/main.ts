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
	loadSpriteAtlas(`sprites/${spr}.png`, {
		[spr]: {
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
}

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
