import { ColorComp, GameObj, HealthComp, Key, PosComp, Vec2 } from 'kaboom'

import {
	BAG_SPEED,
	BOSS_MARK,
	BOSS_MARK_STEP,
	ARROW_SPEED,
	DIZZY_SPEED,
	EXP_BAR_WIDTH,
	GIANT_SPEED,
	HEIGHT,
	HP_BAR_WIDTH,
	MAX_EXP_INIT,
	MAX_EXP_STEP,
	MAX_HP,
	SKELETON_WIZARD_ARROW_SPEED,
	SKELETON_WIZARD_SPEED,
	SPEED,
	SPIDER_SPEED,
	SWORD_SPEED,
	TOUCH_SPEED,
	WIDTH,
	colors,
	dirs,
	STAFF_DMG,
} from '../constants/constants'
import { k } from '../constants/k'
import { addFlash } from './addFlash'
import { bounce } from './bounce'
import { getDirection } from './getDirection'
import { getSpawnPosition } from './getSpawnPosition'
import { highlight } from './highlight'
import { initGameOver } from './initGameOver'
import { initBow } from './initBow'
import { initSword } from './initSword'
import { initStaff } from './initStaff'
import { makeFilter } from './makeFilter'
import { updateToolbar } from './updateToolbar'

export function initGame({ music }) {
	const {
		isKeyDown,
		onKeyDown,
		onKeyPress,
		onCollide,
		onUpdate,
		onTouchStart,
		onTouchEnd,
		onTouchMove,
	} = k

	// All objects in the main game scene will all be children of this "game" game
	// object, so can more easily manage them. For example, we just need to toggle
	// game.paused to pause everything, useful for menues and stuff.
	const game = k.add([
		// We also add a timer component to this master game object and we use
		// game.wait(), game.tween() etc for in game timer events instead of k.wait()
		// so these timers can be paused when game.paused is true
		k.timer(),
	])

	// Also initialize the parent game object of all UI objects
	const ui = game.add([
		// All UI objects don't respond to camera, so we use a fixed() component
		k.fixed(),
		// They should be always drawn above the game, so we explicitly give it a z()
		k.z(100),
	])

	// Pause game when user press escape, we just toggle the paused / hidden props
	// the "game" parent game object and "menu" parent game object
	onKeyPress('escape', () => {
		if (game.paused && !menu.hidden) {
			music.paused = false
			game.paused = false
			menu.paused = true
			menu.hidden = true
		} else if (!game.paused && menu.hidden) {
			music.paused = true
			game.paused = true
			menu.paused = false
			menu.hidden = false
		}
	})

	// Add our main character
	const player = game.add([
		k.pos(WIDTH / 2, HEIGHT / 2),
		k.sprite('human'),
		k.anchor('center'),
		k.area({ scale: 0.8 }),
		k.health(100),
		k.scale(),
		highlight(),
		k.state('idleDown'),
	])

	// Add a screen filter to UI that turns red when player gets hit
	const dmgFilter = ui.add([
		k.fixed(),
		k.rect(k.width(), k.height()),
		k.color(colors.red),
		k.opacity(0),
		k.z(200),
	])

	// Add a screen filter to UI that turns red when player gets hit
	const healFilter = ui.add([
		k.fixed(),
		k.rect(k.width(), k.height()),
		k.color(colors.green),
		k.opacity(0),
		k.z(200),
	])

	// Add some feedbacks when player is hurt showing a short red screen filter effect, and screen shake
	player.onHurt(() => {
		dmgFilter.opacity = Math.min(0.5, dmgFilter.opacity + k.dt() * 2.5)
		k.shake(1)
	})

	// Always recover to 0 damage filter
	dmgFilter.onUpdate(() => {
		dmgFilter.opacity = Math.max(0, dmgFilter.opacity - k.dt())
	})

	// Add feedbacks when we heal
	player.onHeal(() => {
		if (player.hp() > MAX_HP) player.setHP(MAX_HP)
		healFilter.opacity = Math.min(0.5, healFilter.opacity + k.dt() * 2.5)
		// Custom component highlight makes the game objects scale big a bit and then recover to normal
		hpBar.highlight()
		player.highlight()
	})

	// Always recover to 0 health filter
	healFilter.onUpdate(() => {
		healFilter.opacity = Math.max(0, healFilter.opacity - k.dt())
	})

	// A parent game object to manage all swords
	const swords = player.add([k.rotate(0), { speed: SWORD_SPEED }])

	// The swords will be constantly rotating, we only have to rotate the parent game object!
	swords.onUpdate(() => {
		swords.angle += k.dt() * swords.speed
	})

	// Parent game object for all bows
	const bows = player.add([])

	// Parent game object for all staffs
	const staffs = player.add([])

	// Current player level on all weapons
	const levels = {
		sword: 0,
		bow: 0,
		staff: 0,
	}

	presentUpgrades()

	onCollide('arrow', 'enemy', (arrow, enemy) => {
		enemy.hurt(arrow.dmg)
		if (enemy.is('boss')) {
			arrow.destroy()
		}
	})

	// The toolbar UI element to show the current levels on all weapons
	const toolbar = ui.add([
		k.pos(k.vec2(24, k.height() - 24)),
		k.scale(),
		k.sprite('toolbar'),
		k.fixed(),
		k.anchor('botleft'),
		highlight({ scale: 1.1 }),
	])

	initSword({ swords, levels, toolbar })
	initBow({ bows, levels, game, toolbar })
	initStaff({ staffs, levels, game, player, toolbar })
	updateToolbar({ levels, toolbar })

	player.onCollideUpdate('enemy', enemy => {
		if (game.paused) return
		player.hurt(k.dt() * enemy.dmg)
	})

	const hurtSound = k.play('10', { detune: k.rand(-300, 300), loop: false, paused: true })

	player.onCollide('enemy', () => {
		if (game.paused) return
		hurtSound.play()
	})

	player.onCollideEnd('enemy', () => {
		hurtSound.paused = true
	})

	player.onCollide('enemyArrow', arrow => {
		player.hurt(arrow.dmg)
		arrow.destroy()
	})

	player.onDeath(() => {
		k.play('11')
		game.paused = true
		hurtSound.paused = true
		game.destroy()
		timerLabel.destroy()
		setTimer('00:00')
		levels.sword = 0
		levels.bow = 0
		levels.staff = 0
		initGameOver({ music })
	})

	onUpdate(() => {
		k.camPos(player.pos)
	})

	const events = []

	game.onDestroy(() => {
		events.forEach(event => event.cancel())
	})

	for (const dir in dirs) {
		events.push(
			onKeyDown(dir as Key, () => {
				if (game.paused) return
				player.move(dirs[dir].scale(SPEED))
				//fix moving fast when going in diagonals
				// player.move(dirs[dir].scale(k.dt() * SPEED))

				const xMin = player.width / 2
				const yMin = player.height / 2
				const xMax = WIDTH - player.width / 2
				const yMax = HEIGHT - player.height / 2
				if (player.pos.x < xMin) player.pos.x = xMin
				if (player.pos.y < yMin) player.pos.y = yMin
				if (player.pos.x > xMax) player.pos.x = xMax
				if (player.pos.y > yMax) player.pos.y = yMax

				const left = isKeyDown('a') || isKeyDown('left')
				const right = isKeyDown('d') || isKeyDown('right')
				const up = isKeyDown('w') || isKeyDown('up')
				const down = isKeyDown('s') || isKeyDown('down')

				if (up) {
					player.play('walkUp')
				} else if (left) {
					player.play('walkLeft')
				} else if (down) {
					player.play('walkDown')
				} else if (right) {
					player.play('walkRight')
				} else {
					player.play(`idle${dir[0].toUpperCase()}${dir.slice(1)}`)
				}
			})
		)
	}

	function spawnSkeleton() {
		const skeleton = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('skeleton'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.health(100),
			k.state('move'),
			k.timer(),
			k.color(),
			bounce(),
			enemy({ dmg: 20 }),
			'minion',
		])

		skeleton.onStateUpdate('move', async () => {
			const dir = player.pos.sub(skeleton.pos).unit()
			let previousPosition = skeleton.pos.clone()
			const direction = getDirection(dir)
			if (direction === 'up') skeleton.play('walkUp')
			else if (direction === 'left') skeleton.play('walkLeft')
			else if (direction === 'right') skeleton.play('walkRight')
			else if (direction === 'down') skeleton.play('walkDown')
			else skeleton.play('walkDown')
			skeleton.move(dir.scale(BAG_SPEED))
			previousPosition = skeleton.pos.clone()
		})

		skeleton.onStateEnter('dizzy', async () => {
			skeleton.hurt(STAFF_DMG)
			await skeleton.wait(2)
			if (skeleton.state !== 'dizzy') return
			skeleton.enterState('move')
		})

		skeleton.onStateUpdate('dizzy', async () => {
			skeleton.angle += k.dt() * DIZZY_SPEED
		})

		skeleton.onStateEnd('dizzy', async () => {
			skeleton.angle = 0
		})

		return skeleton
	}

	function spawnSpider() {
		const spider = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('spider'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.state('idle'),
			k.health(150),
			k.timer(),
			k.color(),
			bounce(),
			enemy({ dmg: 40 }),
			'minion',
		])

		spider.onUpdate(() => {
			spider.pos.x += k.dt() * k.rand(-1, 1) * 100
			spider.pos.y += k.dt() * k.rand(-1, 1) * 100
		})

		spider.onStateEnter('idle', async () => {
			await spider.wait(2)
			if (spider.state !== 'idle') return
			spider.enterState('attack')

			const dir = player.pos.sub(spider.pos).unit()
			let previousPosition = spider.pos.clone()
			const direction = getDirection(dir)
			if (direction === 'up') spider.play('walkUp')
			else if (direction === 'left') spider.play('walkLeft')
			else if (direction === 'right') spider.play('walkRight')
			else if (direction === 'down') spider.play('walkDown')
			else spider.play('walkDown')
			spider.move(dir.scale(BAG_SPEED))
			previousPosition = spider.pos.clone()
		})

		spider.onStateEnter('attack', async () => {
			const dir = player.pos.sub(spider.pos).unit()
			const dest = player.pos.add(dir.scale(100))
			const dis = player.pos.dist(spider.pos)
			const t = dis / SPIDER_SPEED

			k.play('69', {
				detune: k.rand(-300, 300),
				volume: Math.min(1, 320 / dis),
			})

			await spider.tween(
				spider.pos,
				dest,
				t,
				p => (spider.pos = p),
				k.easings.easeOutQuad
			)
			spider.enterState('idle')
		})

		spider.onStateEnter('dizzy', async () => {
			spider.hurt(STAFF_DMG)
			await spider.wait(2)
			if (spider.state !== 'dizzy') return
			spider.enterState('idle')
		})

		spider.onStateUpdate('dizzy', async () => {
			spider.angle += k.dt() * DIZZY_SPEED
		})

		spider.onStateEnd('dizzy', async () => {
			spider.angle = 0
		})

		return spider
	}

	function spawnSkeletonWizard() {
		const skeletonWizard = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('skeletonWizard'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.state('idle'),
			k.timer(),
			k.health(100),
			k.color(),
			bounce(),
			enemy({ dmg: 20 }),
			'minion',
		])

		skeletonWizard.onUpdate(() => {
			skeletonWizard.flipX = player.pos.x < skeletonWizard.pos.x
		})

		skeletonWizard.onStateEnter('idle', async () => {
			await skeletonWizard.wait(1)
			if (skeletonWizard.state !== 'idle') return
			skeletonWizard.enterState('attack')
		})

		skeletonWizard.onStateEnter('attack', async () => {
			game.add([
				k.sprite('skeletonWizardMagic', { anim: 'magicAnim' }),
				k.scale(0.7),
				k.pos(skeletonWizard.worldPos().add(skeletonWizard.flipX ? -24 : 24, 4)),
				k.move(skeletonWizard.flipX ? k.LEFT : k.RIGHT, SKELETON_WIZARD_ARROW_SPEED),
				k.area({ scale: 0.8 }),
				k.lifespan(10),
				'enemyArrow',
				{ dmg: 20 },
			])

			const dis = player.pos.dist(skeletonWizard.pos)
			k.play('16', {
				detune: k.rand(-300, 300),
				volume: Math.min(1, 320 / dis),
			})
			await skeletonWizard.wait(1)
			if (skeletonWizard.state !== 'attack') return
			skeletonWizard.enterState('move')
		})

		skeletonWizard.onStateUpdate('move', async () => {
			const dir = player.pos.sub(skeletonWizard.pos).unit()
			skeletonWizard.move(dir.scale(SKELETON_WIZARD_SPEED))
			if (
				Math.abs(player.pos.y - skeletonWizard.pos.y) < 50 &&
				player.pos.dist(skeletonWizard.pos) < 400
			) {
				skeletonWizard.enterState('idle')
			}

			let previousPosition = skeletonWizard.pos.clone()
			const direction = getDirection(dir)
			if (direction === 'up') skeletonWizard.play('walkUp')
			else if (direction === 'left') skeletonWizard.play('walkLeft')
			else if (direction === 'right') skeletonWizard.play('walkRight')
			else if (direction === 'down') skeletonWizard.play('walkDown')
			else skeletonWizard.play('walkDown')
			skeletonWizard.move(dir.scale(BAG_SPEED))
			previousPosition = skeletonWizard.pos.clone()
		})

		skeletonWizard.onStateEnter('dizzy', async () => {
			skeletonWizard.hurt(STAFF_DMG)
			await skeletonWizard.wait(2)
			if (skeletonWizard.state !== 'dizzy') return
			skeletonWizard.enterState('idle')
		})

		skeletonWizard.onStateUpdate('dizzy', async () => {
			skeletonWizard.angle += k.dt() * DIZZY_SPEED
		})

		skeletonWizard.onStateEnd('dizzy', async () => {
			skeletonWizard.angle = 0
		})

		return skeletonWizard
	}

	let isBossFighting = false

	async function spawnGiant() {
		if (isBossFighting) return
		isBossFighting = true
		const minions = game.get('minion')
		for (const minion of minions) {
			minion.paused = true
			game.add([
				k.sprite('!'),
				k.pos(minion.pos.add(40, -40)),
				k.scale(),
				k.opacity(1),
				k.lifespan(2, { fade: 0.5 }),
				bounce(),
			])
		}

		await game.wait(2)

		for (const minion of minions) {
			addFlash(minion.pos)
			minion.destroy()
		}

		const maxHP = 2000
		await game.wait(1)
		k.play('2036')
		music.paused = true
		music = k.play('music2', { loop: true })

		const boss = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('giant'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ shape: new k.Rect(k.vec2(0), 80, 160) }),
			k.state('idle'),
			k.timer(),
			k.health(maxHP),
			k.color(),
			bounce(),
			enemy({ dmg: 50, exp: 20 }),
			'boss',
		])

		boss.onDeath(() => {
			isBossFighting = false
			music.paused = true
			music = k.play('music', { loop: true })
		})

		boss.onStateEnter('idle', async () => {
			await boss.wait(1)
			boss.enterState(`charge${k.choose([1, 2])}`)
		})

		boss.onStateEnter('charge1', async () => {
			await boss.wait(1)
			boss.enterState('attack1')
		})

		boss.onStateUpdate('charge1', () => {
			boss.pos = boss.pos.add(k.rand(-5, 5), k.rand(-5, 5))
		})

		boss.onStateEnter('attack1', async () => {
			const num = 20
			for (let i = 0; i < num; i++) {
				const b = game.add([
					k.pos(boss.pos),
					k.circle(12),
					k.outline(4, colors.black),
					k.anchor('center'),
					k.area({ scale: 0.5 }),
					k.move(k.Vec2.fromAngle((360 / num) * i), ARROW_SPEED),
					k.lifespan(10),
					k.color(),
					'enemyArrow',
					{ dmg: 20 },
				])
				b.onUpdate(() => {
					b.color = k.choose(Object.values(colors))
				})
			}

			k.play('251', { volume: 0.3 })
			await boss.wait(1)
			boss.enterState('move')
		})

		boss.onStateEnter('charge2', async () => {
			await boss.wait(1)
			boss.enterState('attack2')
		})

		boss.onStateDraw('charge2', () => {
			const diff = player.pos.sub(boss.pos).unit()
			const p1 = diff.scale(80)
			const p2 = diff.scale(240)
			const p3 = p2.add(k.Vec2.fromAngle(boss.pos.angle(player.pos) + 45).scale(40))
			const p4 = p2.add(k.Vec2.fromAngle(boss.pos.angle(player.pos) - 45).scale(40))
			const opts = {
				width: 4,
				opacity: k.wave(0, 1, k.time() * 12),
				color: colors.black,
			}

			k.drawLine({ p1: p1, p2: p2, ...opts })
			k.drawLine({ p1: p2, p2: p3, ...opts })
			k.drawLine({ p1: p2, p2: p4, ...opts })
		})

		boss.onStateEnter('attack2', async () => {
			const dir = player.pos.sub(boss.pos).unit()
			const dest = player.pos.add(dir.scale(100))
			const dis = player.pos.dist(boss.pos)
			const t = dis / (GIANT_SPEED * 3)

			k.play('251')
			await boss.tween(boss.pos, dest, t, p => (boss.pos = p), k.easings.easeOutQuad)
			boss.enterState('idle')
		})

		boss.onStateEnter('move', async () => {
			await boss.wait(1)
			boss.enterState('idle')
		})

		boss.onStateUpdate('move', async () => {
			const dir = player.pos.sub(boss.pos).unit()
			boss.move(dir.scale(GIANT_SPEED))
		})

		boss.add([k.rect(60, 12, { radius: 6 }), k.color(colors.black), k.pos(-30, -120)])
		const hp = boss.add([
			k.rect(60 - 8, 12 - 8, { radius: 4 }),
			k.color(colors.green),
			k.pos(-30 + 4, -120 + 4),
		])
		hp.onUpdate(() => {
			hp.width = k.lerp(hp.width, (52 * boss.hp()) / maxHP, k.dt() * 12)
		})

		return boss
	}

	game.loop(0.5, () => {
		if (isBossFighting) return
		k.choose([spawnSkeleton, spawnSpider, spawnSkeletonWizard])()
	})

	// When picking up hearts, heal the player
	player.onCollide('healthPotion', hearth => {
		k.play('135', {
			detune: k.rand(-300, 300),
		})
		player.heal(30)
		hearth.destroy()
	})

	function addHeart(pos: Vec2) {
		return game.add([
			k.pos(pos),
			k.scale(),
			k.anchor('center'),
			k.sprite('healthPotion'),
			k.area(),
			bounce({ keep: true }),
			'healthPotion',
		])
	}

	function addBar(pos: Vec2, width: number, color, sprite, getPerc) {
		const bg = ui.add([
			k.pos(pos),
			k.scale(),
			k.rect(width, 16, { radius: 8 }),
			k.fixed(),
			k.color(colors.black),
			highlight({ scale: 1.1 }),
		])

		const bar = bg.add([k.rect(0, 16, { radius: 8 }), k.fixed(), k.color(color)])

		bar.add([k.pos(0, -22), k.sprite(sprite), k.fixed()])
		bar.onUpdate(() => {
			bar.width = k.lerp(bar.width, width * getPerc(), k.dt() * 12)
		})

		return bg
	}

	const hpBar = addBar(
		k.vec2(24, 44),
		HP_BAR_WIDTH,
		colors.red,
		'hpBar',
		() => player.hp() / MAX_HP
	)

	let exp = 0
	let maxExp = MAX_EXP_INIT

	addBar(k.vec2(24, 90), EXP_BAR_WIDTH, colors.green, 'expBar', () => exp / maxExp)

	// addBar(k.vec2(24, 140), MANA_BAR_WIDTH, colors.lightblue, 'manaBar', () => mana / maxMana)

	/**
	 * Score label
	 */

	let score = 0

	function setScore(s: number | ((prev: number) => number)) {
		score = typeof s === 'number' ? s : s(score)
		scoreLabel.text = score + ''
		scoreLabel.highlight()
	}

	const scoreLabel = ui.add([
		k.text('0', {
			transform: idx => ({
				color: k.hsl2rgb((k.time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
				pos: k.vec2(0, k.wave(-4, 4, k.time() * 4 + idx * 0.5)),
				scale: k.wave(1, 1.2, k.time() * 3 + idx),
				angle: k.wave(-9, 9, k.time() * 3 + idx),
			}),
		}),
		k.anchor('topright'),
		k.pos(k.width() - 24, 24),
		k.fixed(),
		k.scale(),
		highlight(),
	])

	/**
	 * Timer label
	 */

	let timer = '00:00'

	const timerLabel = k.add([
		k.timer(),
		{
			value: 0,
		},
		k.text(timer),
		k.anchor('top'),
		k.pos(k.width() / 2, 24),
		k.fixed(),
	])

	timerLabel.loop(1, () => {
		if (game.paused) return
		timerLabel.value++
	})

	timerLabel.onUpdate(() => {
		if (game.paused) return
		const minutes = Math.floor(timerLabel.value / 60)
		const seconds = timerLabel.value % 60
		timerLabel.text = `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`
		setTimer(timerLabel.text)
	})

	const setTimer = (t: string) => {
		timerLabel.text = timer + ''
		timer = t
	}

	let bossMark = BOSS_MARK

	function enemy(
		opts: {
			dmg?: number
			exp?: number
		} = {}
	) {
		return {
			id: 'enemy',
			dmg: opts.dmg ?? 0,
			update() {
				this.color.r = k.lerp(this.color.r, 255, k.dt())
				this.color.g = k.lerp(this.color.g, 255, k.dt())
				this.color.b = k.lerp(this.color.b, 255, k.dt())
			},
			add(this: GameObj<PosComp | HealthComp | ColorComp>) {
				this.onHurt(() => {
					if (this.hp() <= 0) return
					this.color = k.rgb(150, 150, 255)
				})
				this.onDeath(() => {
					this.destroy()
					addFlash(this.pos)
					setScore(s => s + (this.is('boss') ? 2000 : 100))
					if (score >= bossMark) {
						bossMark += BOSS_MARK_STEP + 2000
						spawnGiant()
					}
					exp += opts.exp ?? 1
					if (exp >= maxExp) {
						exp -= maxExp
						presentUpgrades()
						maxExp += MAX_EXP_STEP
					}
					if (k.chance(0.2)) {
						addHeart(this.pos)
					}
				})
			},
		}
	}

	function presentUpgrades() {
		game.paused = true
		const { add, text, fixed, anchor, pos, width, height, z } = k
		const scene = add([fixed(), z(100)])
		const centerWidth = width() / 2
		const centerHeight = height() / 2
		scene.add(makeFilter())
		scene.add([
			text('Choose an upgrade'),
			fixed(),
			anchor('center'),
			pos(width() / 2, 160),
		])

		function addItem(x: number, y: number, item: string, action: () => void) {
			const { rect, outline, fixed, anchor, pos, scale, area, sprite, play, rand } = k
			const box = scene.add([
				rect(80, 80, { radius: 4 }),
				outline(4),
				fixed(),
				anchor('center'),
				pos(x, y),
				scale(2),
				area(),
				bounce({ to: 2 }),
			])
			box.add([
				sprite(item),
				fixed(),
				anchor('center'),
				pos(0, 0),
				scale(1.5),
				bounce({ to: 2 }),
			])
			box.onClick(() => {
				action()
				game.paused = false
				scene.destroy()
				play('6', {
					detune: rand(-100, 100),
				})
			})
		}

		addItem(centerWidth - 200, centerHeight, 'sword', () => {
			levels.sword++
			initSword({ swords, levels, toolbar })
		})

		addItem(centerWidth, centerHeight, 'bow', () => {
			levels.bow++
			initBow({ bows, levels, game, toolbar })
		})

		addItem(centerWidth + 200, centerHeight, 'staff', () => {
			levels.staff++
			initStaff({ staffs, levels, game, player, toolbar })
		})
	}

	let lastTouchPosition = null

	events.push(
		onTouchStart(() => {
			if (game.paused) return
			lastTouchPosition = k.mousePos()
		})
	)

	events.push(
		onTouchMove(() => {
			if (game.paused) return
			const movement = k.mousePos().sub(lastTouchPosition)
			player.move(movement.scale(TOUCH_SPEED))
			lastTouchPosition = k.mousePos()
		})
	)

	events.push(
		onTouchEnd(() => {
			lastTouchPosition = null
		})
	)

	const menu = ui.add([k.fixed(), k.z(100)])

	menu.hidden = true
	menu.paused = true
	menu.add(makeFilter())

	menu.add([
		k.rect(12, 48, { radius: 4 }),
		k.fixed(),
		k.pos(k.width() / 2 - 12, k.height() / 2),
		k.anchor('center'),
	])

	menu.add([
		k.rect(12, 48, { radius: 4 }),
		k.fixed(),
		k.pos(k.width() / 2 + 12, k.height() / 2),
		k.anchor('center'),
	])
}
