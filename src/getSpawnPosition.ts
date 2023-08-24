import { k } from '../constants/k'

const { rand } = k

export // TODO: Dont spawn on player or outside
function getSpawnPosition({ player }) {
	return player.pos.add(rand(-400, 400), rand(-400, 400))
}
