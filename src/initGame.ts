import { ColorComp, GameObj, HealthComp, Key, PosComp, Vec2 } from 'kaboom'

import {
	BAG_SPEED,
	BOSS_MARK,
	BOSS_MARK_STEP,
	BULLET_SPEED,
	BUTTERFLY_SPEED,
	DINO_BULLET_SPEED,
	DINO_SPEED,
	DIZZY_SPEED,
	GIANT_SPEED,
	HEIGHT,
	HP_BAR_WIDTH,
	MAX_EXP_INIT,
	MAX_EXP_STEP,
	MAX_HP,
	SPEED,
	SWORD_SPEED,
	TOUCH_SPEED,
	WIDTH,
	colors,
	dirs,
} from '../constants/constants'
import { k } from '../constants/k'
import { bounce } from './bounce'
import { highlight } from './highlight'
import { initSwords } from './initSwords'
import { initTitle } from './initTitle'
import { makeFilter } from './makeFilter'
import { updateToolbar } from './updateToolbar'
import { initGuns } from './initGuns'
import { initTrumpet } from './initTrumpet'
import { getSpawnPosition } from './getSpawnPosition'

export function initGame({ music }) {
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
	k.onKeyPress('escape', () => {
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
		k.sprite('player'),
		k.anchor('center'),
		k.area({ scale: 0.8 }),
		k.health(100),
		k.scale(),
		highlight(),
	])

	// Add a screen filter to UI that turns red when player gets hit
	const dmgFilter = ui.add([
		k.fixed(),
		k.rect(k.width(), k.height()),
		k.color(colors.red),
		k.opacity(0),
		k.z(200),
	])

	// Add some feedbacks when player is hurt - show a short red screen filter effect
	// and screen shake
	player.onHurt(() => {
		// Cap the damage filter opacity to 0.7
		dmgFilter.opacity = Math.min(0.7, dmgFilter.opacity + k.dt() * 2.5)
		k.shake(5)
	})

	// Always recover to 0
	dmgFilter.onUpdate(() => {
		dmgFilter.opacity = Math.max(0, dmgFilter.opacity - k.dt())
	})

	// Add feedbacks when we heal
	player.onHeal(() => {
		if (player.hp() > MAX_HP) player.setHP(MAX_HP)
		// highlight() is from the custom component highlight(), which makes the game
		// objects scale big a bit and then recover to normal
		hpBar.highlight()
		player.highlight()
	})

	// A parent game object to manage all swords
	const swords = player.add([k.rotate(0), { speed: SWORD_SPEED }])

	// The swords will be constantly rotating, we only have to rotate the parent
	// game object!
	swords.onUpdate(() => {
		swords.angle += k.dt() * swords.speed
	})

	// Parent game object for all guns
	const guns = player.add([])
	// Parent game object for all trumpets
	const trumpets = player.add([])

	// Current player level on all weapons, start with level 1 on sword
	const levels = {
		sword: 1,
		gun: 0,
		trumpet: 0,
	}

	k.onCollide('bullet', 'enemy', (b, e) => {
		e.hurt(b.dmg)
		if (e.is('boss')) {
			b.destroy()
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

	initSwords({ swords, levels, toolbar })
	initGuns({ guns, levels, game, toolbar })
	initTrumpet({ trumpets, levels, game, player, toolbar })
	updateToolbar({ levels, toolbar })

	// TODO: this still runs when game is paused
	player.onCollideUpdate('enemy', e => {
		if (game.paused) return
		player.hurt(k.dt() * e.dmg)
	})

	const hurtSnd = k.play('alarm', { loop: true, paused: true })

	player.onCollide('enemy', () => {
		hurtSnd.play()
	})

	player.onCollideEnd('enemy', () => {
		// const cols = player.getCollisions()
		hurtSnd.paused = true
	})

	player.onCollide('enemybullet', e => {
		player.hurt(e.dmg)
		e.destroy()
	})

	player.onDeath(() => {
		game.paused = true
		hurtSnd.paused = true
		game.destroy()
		initTitle({ music })
	})

	k.onUpdate(() => {
		k.camPos(player.pos)
	})

	const events = []

	game.onDestroy(() => {
		events.forEach(ev => ev.cancel())
	})

	for (const dir in dirs) {
		events.push(
			k.onKeyDown(dir as Key, () => {
				if (game.paused) return
				player.move(dirs[dir].scale(SPEED))
				const xMin = player.width / 2
				const yMin = player.height / 2
				const xMax = WIDTH - player.width / 2
				const yMax = HEIGHT - player.height / 2
				if (player.pos.x < xMin) player.pos.x = xMin
				if (player.pos.y < yMin) player.pos.y = yMin
				if (player.pos.x > xMax) player.pos.x = xMax
				if (player.pos.y > yMax) player.pos.y = yMax
			})
		)
	}

	function spawnBag() {
		const bag = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('bag'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.health(100),
			k.state('move'),
			k.timer(),
			k.color(),
			bounce(),
			enemy({ dmg: 50 }),
			'minion',
		])

		bag.onStateUpdate('move', async () => {
			const dir = player.pos.sub(bag.pos).unit()
			bag.move(dir.scale(BAG_SPEED))
		})

		bag.onStateEnter('dizzy', async () => {
			await bag.wait(2)
			if (bag.state !== 'dizzy') return
			bag.enterState('move')
		})

		bag.onStateUpdate('dizzy', async () => {
			bag.angle += k.dt() * DIZZY_SPEED
		})

		bag.onStateEnd('dizzy', async () => {
			bag.angle = 0
		})

		bag.add([k.rect(40, 8, { radius: 4 }), k.color(colors.black), k.pos(-20, -40)])
		bag.add([k.rect(40, 8, { radius: 4 }), k.color(colors.green), k.pos(-20, -40)])
		bag.add([k.rect(40, 8, { radius: 4 }), k.outline(4, colors.black), k.pos(-20, -40)])

		return bag
	}

	function spawnButterfly() {
		const butterfly = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('butterfly'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.state('idle'),
			k.health(100),
			k.timer(),
			k.color(),
			bounce(),
			enemy({ dmg: 50 }),
			'minion',
		])

		butterfly.onUpdate(() => {
			butterfly.pos.x += k.dt() * k.rand(-1, 1) * 100
			butterfly.pos.y += k.dt() * k.rand(-1, 1) * 100
		})

		butterfly.onStateEnter('idle', async () => {
			await butterfly.wait(2)
			if (butterfly.state !== 'idle') return
			butterfly.enterState('attack')
		})

		butterfly.onStateEnter('attack', async () => {
			const dir = player.pos.sub(butterfly.pos).unit()
			const dest = player.pos.add(dir.scale(100))
			const dis = player.pos.dist(butterfly.pos)
			const t = dis / BUTTERFLY_SPEED

			k.play('wooosh', {
				detune: k.rand(-300, 300),
				volume: Math.min(1, 320 / dis),
			})

			await butterfly.tween(
				butterfly.pos,
				dest,
				t,
				p => (butterfly.pos = p),
				k.easings.easeOutQuad
			)
			butterfly.enterState('idle')
		})

		butterfly.onStateEnter('dizzy', async () => {
			await butterfly.wait(2)
			if (butterfly.state !== 'dizzy') return
			butterfly.enterState('idle')
		})

		butterfly.onStateUpdate('dizzy', async () => {
			butterfly.angle += k.dt() * DIZZY_SPEED
		})

		butterfly.onStateEnd('dizzy', async () => {
			butterfly.angle = 0
		})

		return butterfly
	}

	function spawnDino() {
		const dino = game.add([
			k.pos(getSpawnPosition({ player })),
			k.sprite('dino'),
			k.anchor('center'),
			k.scale(),
			k.rotate(0),
			k.area({ scale: 0.8 }),
			k.state('idle'),
			k.timer(),
			k.health(100),
			k.color(),
			bounce(),
			enemy({ dmg: 50 }),
			'minion',
		])

		dino.onUpdate(() => {
			dino.flipX = player.pos.x < dino.pos.x
		})

		dino.onStateEnter('idle', async () => {
			await dino.wait(1)
			if (dino.state !== 'idle') return
			dino.enterState('attack')
		})

		dino.onStateEnter('attack', async () => {
			game.add([
				k.rect(24, 8, { radius: 2 }),
				k.outline(4, colors.black),
				k.pos(dino.worldPos().add(dino.flipX ? -24 : 24, 4)),
				k.move(dino.flipX ? k.LEFT : k.RIGHT, DINO_BULLET_SPEED),
				k.color(colors.grey),
				k.area(),
				k.lifespan(10),
				'enemybullet',
				{ dmg: 20 },
			])
			const dis = player.pos.dist(dino.pos)
			k.play('shoot', {
				detune: k.rand(-300, 300),
				volume: Math.min(1, 320 / dis),
			})
			await dino.wait(1)
			if (dino.state !== 'attack') return
			dino.enterState('move')
		})

		dino.onStateUpdate('move', async () => {
			const dir = player.pos.sub(dino.pos).unit()
			dino.move(dir.scale(DINO_SPEED))
			if (Math.abs(player.pos.y - dino.pos.y) < 50 && player.pos.dist(dino.pos) < 400) {
				dino.enterState('idle')
			}
		})

		dino.onStateEnter('dizzy', async () => {
			await dino.wait(2)
			if (dino.state !== 'dizzy') return
			dino.enterState('idle')
		})
		dino.onStateUpdate('dizzy', async () => {
			dino.angle += k.dt() * DIZZY_SPEED
		})
		dino.onStateEnd('dizzy', async () => {
			dino.angle = 0
		})

		return dino
	}

	let isBossFighting = false

	async function spawnGiant() {
		if (isBossFighting) return
		isBossFighting = true
		const minions = game.get('minion')
		for (const m of minions) {
			m.paused = true
			game.add([
				k.sprite('!'),
				k.pos(m.pos.add(40, -40)),
				k.scale(),
				k.opacity(1),
				k.lifespan(2, { fade: 0.5 }),
				bounce(),
			])
		}

		await game.wait(2)

		for (const m of minions) {
			k.addKaboom(m.pos)
			m.destroy()
		}
		const maxHP = 2000
		await game.wait(1)
		k.play('mystic')
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
			enemy({ dmg: 80, exp: 20 }),
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
					k.move(k.Vec2.fromAngle((360 / num) * i), BULLET_SPEED),
					k.lifespan(10),
					k.color(),
					'enemybullet',
					{ dmg: 20 },
				])
				b.onUpdate(() => {
					b.color = k.choose(Object.values(colors))
				})
			}

			k.play('error', { volume: 0.3 })
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

			k.play('error')
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

		// TODO: clean
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
		k.choose([spawnBag, spawnButterfly, spawnDino])()
	})

	// When picking up hearts, heal the player
	player.onCollide('heart', hearth => {
		k.play('powerUp')
		player.heal(10)
		hearth.destroy()
	})

	function addHeart(pos: Vec2) {
		return game.add([
			k.pos(pos),
			k.scale(),
			k.anchor('center'),
			k.sprite('heart'),
			k.area(),
			bounce({ keep: true }),
			'heart',
		])
	}

	function addBar(pos, width, color, sprite, getPerc) {
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
		colors.green,
		'hpBar',
		() => player.hp() / MAX_HP
	)

	// const expBar = addBar(
	//   k.vec2(24, 90),
	// EXP_BAR_WIDTH,
	//   colors.lightblue,
	//   'expBar',
	//   () => exp / maxExp
	// )

	let score = 0
	let exp = 0
	let maxExp = MAX_EXP_INIT

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

	let bossMark = BOSS_MARK

	function enemy(
		opts: {
			dmg?: number
			exp?: number
		} = {}
	) {
		return {
			id: 'enemy',
			dmg: opts.dmg ?? 50,
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
					k.addKaboom(this.pos)
					setScore(s => s + (this.is('boss') ? 2000 : 100))
					if (score >= bossMark) {
						bossMark += BOSS_MARK_STEP + 2000
						spawnGiant()
					}
					exp += opts.exp ?? 1
					if (exp >= maxExp) {
						exp = exp - maxExp
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
		const scene = k.add([k.fixed(), k.z(100)])
		game.paused = true
		scene.add(makeFilter())
		scene.add([
			k.text('Choose an upgrade'),
			k.fixed(),
			k.anchor('center'),
			k.pos(k.width() / 2, 160),
		])

		function addItem(x, thing, action) {
			const box = scene.add([
				k.rect(80, 80, { radius: 4 }),
				k.outline(4),
				k.fixed(),
				k.anchor('center'),
				k.pos(x, 320),
				k.scale(2),
				k.area(),
				bounce({ to: 2 }),
			])
			box.add([k.sprite(thing), k.fixed(), k.anchor('center')])
			box.onClick(() => {
				action()
				game.paused = false
				scene.destroy()
				k.burp()
			})
		}

		addItem(k.width() / 2, 'sword', () => {
			levels.sword += 1
			initSwords({ swords, levels, toolbar })
		})

		addItem(k.width() / 2 - 200, 'gun', () => {
			levels.gun += 1
			initGuns({ guns, levels, game, toolbar })
		})

		addItem(k.width() / 2 + 200, 'trumpet', () => {
			levels.trumpet += 1
			initTrumpet({ trumpets, levels, game, player, toolbar })
		})
	}

	let lastTouchPosition = null

	events.push(
		k.onTouchStart(() => {
			if (game.paused) return
			lastTouchPosition = k.mousePos()
		})
	)

	events.push(
		k.onTouchMove(() => {
			if (game.paused) return
			const movement = k.mousePos().sub(lastTouchPosition)
			player.move(movement.scale(TOUCH_SPEED))
			lastTouchPosition = k.mousePos()
		})
	)

	events.push(
		k.onTouchEnd(() => {
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
