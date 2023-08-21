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

k.volume(0.5)
k.setBackground(k.BLACK)

for (const spr of sprites) {
  k.loadSprite(spr, `sprites/${spr}.png`)
}

for (const spr of aseprites) {
  k.loadAseprite(spr, `sprites/${spr}.png`, `sprites/${spr}.json`)
}

k.loadBitmapFont('happy', 'sprites/happy_28x36.png', 28, 36, {
  // TODO: not working
  outline: 4,
})

for (const snd of sounds) {
  k.loadSound(snd, `sounds/${snd}.mp3`)
}

const music = k.play('music', {
  loop: true,
})

// Add the background tiles
for (let i = 0; i < WIDTH / TILE_WIDTH; i++) {
  for (let j = 0; j < HEIGHT / TILE_HEIGHT; j++) {
    k.add([
      k.pos(j * TILE_WIDTH, i * TILE_HEIGHT),
      k.sprite('field', { frame: k.randi(0, 4) }),
    ])
  }
}

initTitle({ music })
