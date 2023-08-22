import { k } from '../constants/k'

const { rand } = k

export // TODO: Dont spawn on bean or outside
function getSpawnPosition({ bean }) {
	return bean.pos.add(rand(-400, 400), rand(-400, 400))
}
