import { sounds } from '../constants/constants'

import { k } from '../constants/k'

export const loadSounds = () => {
	const { loadSound } = k

	for (const sound of sounds) {
		loadSound(sound, `sounds/${sound}.wav`)
	}
}
