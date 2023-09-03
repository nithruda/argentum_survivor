import { fonts } from '../constants/constants'

import { k } from '../constants/k'

export const loadFonts = () => {
	const { loadFont } = k
	for (const font of fonts) {
		loadFont(font, `fonts/${font}.ttf`)
	}
}
