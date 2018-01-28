export default class Game {
	constructor(canvas, mainloop) {
		this.canvas = canvas
		this.mainloop = mainloop
		this.ctx = canvas.getContext('2d')
		this.tick = 0
		this.t = 0
		this.gs = canvas.width / 20
		this.rows = canvas.height / this.gs
		this.cols = canvas.width / this.gs
		this.colors = {
			bg: '#222',
			grid: '#eee',
			snake: '#f00'
		}
		this.direction = 'right'
		this.snake = [
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3],
			[0, 4],
		]
		window.addEventListener('keydown', (e) => {
			console.log(e.keyCode)
			this.lastKeyCode = e.keyCode
		})
	}

	move(direction) {
		switch (direction) {
			case 'left':
				if (this.direction !== 'right') {
					this.direction = 'left'
				}
				break
			case 'up':
				if (this.direction !== 'down') {
					this.direction = 'up'
				}
				break
			case 'right':
				if (this.direction !== 'left') {
					this.direction = 'right'
				}
				break
			case 'down':
				if (this.direction !== 'up') {
					this.direction = 'down'
				}
				break
		}
	}

	keydown(keyCode) {
		switch(keyCode) {
			case 37:
				this.move('left')
				break
			case 38:
				this.move('up')
				break
			case 39:
				this.move('right')
				break
			case 40:
				this.move('down')
				break
		}
	}

	moveForward() {
		const lastHead = this.snake[0]
		let head = []
		switch (this.direction) {
			case 'up':
				head = [lastHead[0], lastHead[1] - 1]
				break
			case 'right':
				head = [lastHead[0] + 1, lastHead[1]]
				break
			case 'down':
				head = [lastHead[0], lastHead[1] + 1]
				break
			case 'left':
				head = [lastHead[0] - 1, lastHead[1]]
				break
			default:
				throw 'Unexpected direction'
		}
		let nextSnake = [head].concat(this.snake)
		if (this.snakeIsDead(nextSnake)) {
			this.mainloop.stop()
		} else {
			this.snake = nextSnake
			this.snake = this.snake.slice(0, this.snake.length - 1)
		}

	}


	tickGame() {
		this.tick++
		if (this.lastKeyCode) {
			this.keydown(this.lastKeyCode)
		}
		this.moveForward()
	}

	snakeIsDead(snake) {
		let seen = {}
		for (let point of snake) {
			let xy = `${point[0]},${point[1]}`
			console.log(xy)
			if (seen[xy]) {
				return true
			} else {
				seen[xy] = true
			}
		}
		return false
	}

	update(delta) {
		const last = this.t
		// tick every .25 seconds
		this.t = this.t + (delta * 0.002)
		if (this.tick < Math.floor(this.t)) {
			return this.tickGame()
		}
	}

	getFPS() {
		return Math.round(this.mainloop.getFPS())
	}

	gx(x) {
		return this.gs * x
	}

	gy(y) {
		return this.gs * y
	}

	drawSnake() {
		const {colors, ctx, gs} = this
		ctx.fillStyle = colors.snake
		ctx.strokeStyle = colors.grid
		this.snake.forEach(point => {
			ctx.fillRect(this.gx(point[0]), this.gy(point[1]), gs, gs)
			ctx.strokeRect(this.gx(point[0]), this.gy(point[1]), gs, gs)
		})
	}

	drawBackground() {
		let {ctx, colors, rows, cols, gs} = this
		ctx.fillStyle = this.colors.bg
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		ctx.strokeStyle = this.colors.grid
		ctx.lineWidth = 1
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				this.ctx.strokeRect(this.gx(x), this.gy(y), gs, gs)
			}
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	draw() {
		this.clear()
		this.drawBackground()
		this.drawSnake()
		this.ctx.font = '10px sans-serif'
		this.ctx.fillStyle = 'green'
		this.ctx.fillText(`${this.getFPS()} FPS`, 2, 10)
	}
}