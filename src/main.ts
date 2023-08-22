import {
	HEIGHT,
	TILE_HEIGHT,
	TILE_WIDTH,
	WIDTH,
	aseprites,
	sounds,
	sprites,
} from '../constants/constants'
import { k } from '../constants/k'
import { initTitle } from './initTitle'

const {
	volume,
	setBackground,
	BLACK,
	loadSprite,
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
	loadSprite(spr, `sprites/${spr}.png`)
}

for (const spr of aseprites) {
	loadAseprite(spr, `sprites/${spr}.png`, `sprites/${spr}.json`)
}

loadBitmapFont('happy', 'sprites/happy_28x36.png', 28, 36, {
	// TODO: not working
	outline: 4,
})

for (const snd of sounds) {
	loadSound(snd, `sounds/${snd}.mp3`)
}

const music = play('music', {
	loop: true,
})

// Add the background tiles
for (let i = 0; i < WIDTH / TILE_WIDTH; i++) {
	for (let j = 0; j < HEIGHT / TILE_HEIGHT; j++) {
		add([pos(j * TILE_WIDTH, i * TILE_HEIGHT), sprite('field', { frame: randi(0, 4) })])
	}
}

initTitle({ music })
