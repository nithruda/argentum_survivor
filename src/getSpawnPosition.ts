import { k } from '../constants/k'

export // TODO: Dont spawn on bean or outside
function getSpawnPosition({ bean }) {
	return bean.pos.add(k.rand(-400, 400), k.rand(-400, 400))
}
