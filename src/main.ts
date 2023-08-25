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
	loop: true,
})

// Add the background tiles
for (let i = 0; i < WIDTH / TILE_WIDTH; i++) {
	for (let j = 0; j < HEIGHT / TILE_HEIGHT; j++) {
		add([pos(j * TILE_WIDTH, i * TILE_HEIGHT), sprite('field', { frame: randi(0, 4) })])
	}
}

initTitle({ music })
