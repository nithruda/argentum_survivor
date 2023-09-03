import { Vec2 } from 'kaboom'

export const getDirection = (dir: Vec2) => {
	if (Math.abs(dir.x) > Math.abs(dir.y)) {
		return dir.x > 0 ? 'right' : 'left'
	} else {
		return dir.y > 0 ? 'down' : 'up'
	}
}
