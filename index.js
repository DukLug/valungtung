const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y

		this.radius = radius
		this.color = 'black'
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#F3';
  for (var i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  color += "C";
  return color;
}

function weightedRandom(max, numDice) {
    let num = 0;
    for (let i = 0; i < numDice; i++) {
        num += Math.random() * (max/numDice);
    }    
    return num;
}

class Particle {
	constructor(x, y, radius, color) {
		this.x = x 
		this.y = y 
		this.radius = 1.5
		this.color = color
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	} 

	update() {
	  	//this.color = getRandomColor()
	  	this.radius = Math.random() + 0.01
		this.draw()
	}
}

class RunningParticle {
	constructor(x, y, radius, color) {
		this.x = x 
		this.y = y 
		this.radius = 1.5
		this.color = color
		this.velocity
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	} 

	update() {
	  	//this.color = getRandomColor()
	  	this.radius = Math.random() + 1
		this.draw()
	}
}

const x = canvas.width / 2
const y = canvas.height /2
const player = new Player(x, y, 30, 'blue')
const particles = []

function createParticle1() {
	const radius = 1.5
  	const color = "#FA0039"
	let x 
	let y 
	var h = 2 * (Math.random() - 0.5) * 1.1390306027
	var k = Math.sqrt(Math.pow(h, 4/3) + 4 * (1 - h*h))
	var q = weightedRandom(30, 2) - 15
	var p = weightedRandom(30, 2) - 15
	var randomNumber = Math.floor(Math.random() * 4);
	if(randomNumber == 0) {
		x = canvas.width / 2 + h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) + k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}
	else if(randomNumber == 1) {
	  	x = canvas.width / 2 - h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) + k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}

	else if (randomNumber == 2) {
	  	x = canvas.width / 2 + h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) - k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}

	else {
	  	x = canvas.width / 2 - h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) - k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}
}

function createParticle2() {
	const radius = 1.5
  	const color = "#FA0039"
	let x 
	let y 
	var h = 2 * (Math.random() - 0.5) * 1.1390306027
	var k = Math.sqrt(Math.pow(h, 4/3) + 4 * (1 - h*h))
	var q = weightedRandom(80, 2) - 40
	var p = weightedRandom(80, 2) - 40
	var randomNumber = Math.floor(Math.random() * 4);
	if(randomNumber == 0) {
		x = canvas.width / 2 + h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) + k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}
	else if(randomNumber == 1) {
	  	x = canvas.width / 2 - h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) + k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}

	else if (randomNumber == 2) {
	  	x = canvas.width / 2 + h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) - k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}

	else {
	  	x = canvas.width / 2 - h * 100 + q
	  	y = canvas.height / 2 - 50 * (Math.pow(h, 2/3) - k) + p
	  	particles.push(new Particle(x, y, radius, color))
	}
}
function createParticle() {
	for(var i = 0; i < 60; i++) {
		createParticle1()
	}
	for(var i = 0; i < 50; i++) {
		createParticle2()
	}
}



function spawnParticle() {
	setInterval(() => {
		if (particles.length < 20000) {
			createParticle()
		}
		if (particles.length > 19900) {
			particles.forEach((particle, index) => {
			particles.splice(particle, 1)
			});
		}
		
	},0.1) 
}

function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	player.draw()

	particles.forEach((particle, index) => {
		particle.update()
	});
	
}


animate()
spawnParticle()


