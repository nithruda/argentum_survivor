import { sounds, wavs } from '../constants/constants'

import { k } from '../constants/k'

export const loadSounds = () => {
	const { loadSound } = k

	for (const sound of sounds) {
		loadSound(sound, `sounds/${sound}.mp3`)
	}

	for (const wav of wavs) {
		loadSound(wav, `sounds/wav/${wav}.wav`)
	}
}
