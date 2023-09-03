import { HEIGHT, TILE_HEIGHT, TILE_WIDTH, WIDTH } from '../constants/constants'
import { k } from '../constants/k'

export const loadBackground = () => {
	const { add, pos, sprite, randi } = k

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
}
