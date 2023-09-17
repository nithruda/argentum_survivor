import { aseprites, images, sprites } from '../constants/constants'
import { k } from '../constants/k'

export const loadSprites = () => {
	const { loadSpriteAtlas, loadAseprite, loadSprite } = k

	for (const spr of sprites) {
		k.loadSprite(spr, `sprites/${spr}.png`)
	}

	for (const img of images) {
		loadSprite(img, `images/${img}.png`)
	}

	for (const aspr of aseprites) {
		loadAseprite(aspr, `sprites/${aspr}.png`, `sprites/${aspr}.json`)
	}

	loadSpriteAtlas(`sprites/human.png`, {
		human: {
			x: 0,
			y: 0,
			width: 135,
			height: 191,
			sliceX: 5,
			sliceY: 4,
			anims: {
				idleDown: { from: 0, to: 0 },
				idleUp: { from: 5, to: 5 },
				idleLeft: { from: 11, to: 11 },
				idleRight: { from: 16, to: 16 },
				walkDown: { from: 0, to: 4, speed: 14, loop: true },
				walkUp: { from: 5, to: 9, speed: 14, loop: true },
				walkLeft: { from: 10, to: 14, speed: 14, loop: true },
				walkRight: { from: 15, to: 19, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/skeleton.png`, {
		skeleton: {
			x: 0,
			y: 0,
			width: 256,
			height: 256,
			sliceX: 8,
			sliceY: 5,
			anims: {
				idleDown: { from: 0, to: 0 },
				idleUp: { from: 9, to: 9 },
				idleLeft: { from: 12, to: 12 },
				idleRight: { from: 16, to: 16 },
				walkDown: { from: 0, to: 7, speed: 14, loop: true },
				walkUp: { from: 10, to: 15, speed: 14, loop: true },
				walkLeft: { from: 16, to: 23, speed: 14, loop: true },
				walkRight: { from: 24, to: 31, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/spider.png`, {
		spider: {
			x: 0,
			y: 0,
			width: 795,
			height: 528,
			sliceX: 5,
			sliceY: 4,
			anims: {
				idleDown: { from: 0, to: 0 },
				idleUp: { from: 5, to: 5 },
				idleLeft: { from: 11, to: 11 },
				idleRight: { from: 16, to: 16 },
				walkDown: { from: 0, to: 4, speed: 14, loop: true },
				walkUp: { from: 5, to: 9, speed: 14, loop: true },
				walkLeft: { from: 10, to: 14, speed: 14, loop: true },
				walkRight: { from: 15, to: 19, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/skeletonWizard.png`, {
		skeletonWizard: {
			x: 0,
			y: 0,
			width: 217,
			height: 207,
			sliceX: 8,
			sliceY: 4,
			anims: {
				idleDown: { from: 0, to: 0 },
				idleUp: { from: 8, to: 8 },
				idleLeft: { from: 16, to: 16 },
				idleRight: { from: 24, to: 24 },
				walkDown: { from: 0, to: 7, speed: 14, loop: true },
				walkUp: { from: 8, to: 15, speed: 14, loop: true },
				walkLeft: { from: 15, to: 19, speed: 14, loop: true },
				walkRight: { from: 20, to: 27, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/flash.png`, {
		flash: {
			x: 0,
			y: 0,
			width: 119,
			height: 17,
			sliceX: 8,
			sliceY: 1,
			anims: {
				flashAnim: { from: 0, to: 8, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/items2.png`, {
		cup: {
			x: 0,
			y: 0,
			width: 34,
			height: 34,
		},
		healthPotion: {
			x: 450,
			y: 34,
			width: 34,
			height: 34,
		},
	})

	loadSpriteAtlas(`sprites/enemyMagic.png`, {
		skeletonWizardMagic: {
			x: 0,
			y: 265,
			width: 512,
			height: 320,
			sliceX: 8,
			sliceY: 1,
			anims: {
				magicAnim: { from: 0, to: 7, speed: 14, loop: true },
			},
		},
	})

	loadSpriteAtlas(`sprites/sword.png`, {
		sword: {
			x: 0,
			y: 225,
			width: 156,
			height: 256,
			sliceX: 6,
			sliceY: 6,
		},
	})

	loadSpriteAtlas(`sprites/bow.png`, {
		bow: {
			x: 0,
			y: 205,
			width: 170,
			height: 256,
			sliceX: 6,
			sliceY: 6,
		},
	})

	loadSpriteAtlas(`sprites/arrow.png`, {
		arrow: {
			x: 0,
			y: 0,
			width: 293,
			height: 35,
			sliceX: 9,
			sliceY: 1,
		},
	})

	loadSpriteAtlas(`sprites/staff.png`, {
		staff: {
			x: 0,
			y: 205,
			width: 170,
			height: 256,
			sliceX: 6,
			sliceY: 6,
		},
	})
}
