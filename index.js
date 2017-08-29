document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.createElement('canvas')
	document.body.appendChild(canvas)
	let context = null
	let width = null
	let height = null
	const init = () => {
		width = canvas.width = document.documentElement.clientWidth
		height = canvas.height = document.documentElement.clientHeight
		context = canvas.getContext('2d')
	}
	

	const duration = 1000
	let start = 0
	let points = createPoints(4)
	let tail = []

	const render = () => {
		const now = Date.now()
		if(start + duration < now){
			start = now - ((now - start) % duration)
			points = [points[points.length - 1], reverse(points), ...createPoints(points.length - 2)]
		}
		const progress = (now - start) / duration

		context.clearRect(0, 0, width, height)

		context.beginPath()
		context.moveTo(points[0].x * width, points[0].y * height)
		context.lineTo(points[1].x * width, points[1].y * height)
		context.moveTo(points[2].x * width, points[2].y * height)
		context.lineTo(points[3].x * width, points[3].y * height)
		context.strokeStyle = '#444'
		context.stroke()

		context.fillStyle = '#fff'
		points.forEach(point => {
			context.fillRect(point.x * width - 2, point.y * height - 2, 4, 4)
		})

		const p = bejier(points, progress)
		context.fillStyle = '#fff'
		context.beginPath()
		context.arc(p.x * width, p.y * height, 2, 0, Math.PI * 2, false)
		context.fill()

		window.requestAnimationFrame(render)
	}

	init()
	render()

	window.addEventListener('resize', init)

	function createPoints(len){
		return Array.from(Array(len), createPoint)
	}

	function createPoint(){
		return {
			x: (Math.random() * 0.5) + 0.25,
			y: (Math.random() * 0.5) + 0.25
		}
	}

})

function bejier(points, progress){
		if(points.length <= 1) { //pointsが1点になった時点で終了
			return points[0];
		}

		const len = points.length - 1
		const res = Array(len)
		for(let i = 0; i < len; i++) {
			res[i] = f(points[i], points[i + 1], progress)
		}
		return bejier(res, progress);
}

function f(start, end, progress){
	return {
		x: (end.x - start.x) * progress + start.x,
		y: (end.y - start.y) * progress + start.y
	}
}

function reverse(points){
	const len = points.length
	const a = points[len - 2]
	const b = points[len - 1]
	return {
		x: -(a.x - b.x) + b.x,
		y: -(a.y - b.y) + b.y
	}
}

