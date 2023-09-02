import {
	HEIGHT,
	TILE_HEIGHT,
	TILE_WIDTH,
	WIDTH,
	aseprites,
	sounds,
	sprites,
	images,
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
	loadBitmapFont,
	loadSound,
	randi,
	sprite,
} = k

volume(0.5)
setBackground(BLACK)

for (const spr of sprites) {
	loadSpriteAtlas(`sprites/${spr}.png`, {
		[spr]: {
			x: 0,
			y: 0,
			width: 150,
			height: 180,
			sliceX: 6,
			sliceY: 4,
			anims: {
				idleDown: { from: 0, to: 0 },
				idleUp: { from: 6, to: 6 },
				idleLeft: { from: 12, to: 12 },
				idleRight: { from: 17, to: 17 },
				walkDown: { from: 0, to: 5, speed: 14, loop: true },
				walkUp: { from: 6, to: 11, speed: 14, loop: true },
				walkLeft: { from: 12, to: 16, speed: 14, loop: true },
				walkRight: { from: 18, to: 22, speed: 14, loop: true },
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

loadBitmapFont('happy', 'sprites/happy_28x36.png', 28, 36, {
	outline: 4,
})

for (const sound of sounds) {
	loadSound(sound, `sounds/${sound}.mp3`)
}

const music = play('music', {
	// loop: true,
})

// Add the background tiles
for (let i = 0; i < WIDTH / TILE_WIDTH; i++) {
	for (let j = 0; j < HEIGHT / TILE_HEIGHT; j++) {
		add([pos(j * TILE_WIDTH, i * TILE_HEIGHT), sprite('field', { frame: randi(0, 4) })])
	}
}

initTitle({ music })
