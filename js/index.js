import mainloop from 'mainloop.js'
import Game from './Game'

const canvas = document.getElementById('canvas'),
	game = new Game(canvas, mainloop)
let fps = 0

mainloop
	.setUpdate((delta) => game.update(delta))
	.setDraw(() => game.draw())
	.start()
