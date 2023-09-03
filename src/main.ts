import { k } from '../constants/k'
import { initTitle } from './initTitle'
import { loadBackground } from './loadBackground'
import { loadFonts } from './loadFonts'
import { loadSounds } from './loadSounds'
import { loadSprites } from './loadSprites'

const { BLACK, volume, setBackground, play } = k

volume(0.5)
setBackground(BLACK)

loadSprites()
loadFonts()
loadSounds()
loadBackground()

const music = play('music', {
	loop: true,
})

initTitle({ music })
