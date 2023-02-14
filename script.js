var settings = {
    particles: {
        length: 5000,
        duration: 2.8,
        velocity: 80,
        effect: -0.95,
        size: 20,
    },
};

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
canvas.width = innerWidth;
canvas.height = innerHeight;

/*
 * RequestAnimationFrame polyfill by Erik Möller
*/
(function() {
    var b = 0;
    var c = ["ms", "moz", "webkit", "o"];
    for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
        window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(h, e) {
            var d = new Date().getTime();
            var f = Math.max(0, 16 - (d - b));
            var g = window.setTimeout(function() {
                h(d + f)
            }, f);
            b = d + f;
            return g
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(d) {
            clearTimeout(d)
        }
    }
}());

function weightedRandom(max, numDice) {
    let num = 0;
  for (let i = 0; i < numDice; i++) {
  num += Math.random() * (max/numDice);
  }
  return num;
}

var positionPoint =(function() {
    function Point() {
        let rx = weightedRandom(50, 2) - 25;
        let ry = weightedRandom(50, 3) - 25;
        let t = (Math.random() - 0.5) * 2 * Math.PI
        this.x = 200 * Math.pow(Math.sin(t), 3) + canvas.width / 2 + rx
        this.y = -1*(150 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25) + canvas.height / 2 + ry
    };
    return Point;   
})();



var Point = (function() {
    function Point(x, y) {
        this.x = (typeof x !== 'undefined') ? x : 0;
        this.y = (typeof y !== 'undefined') ? y : 0;
    }
    Point.prototype.clone = function() {
        return new Point(this.x, this.y);
    };
    Point.prototype.length = function(length) {
        if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    };
    Point.prototype.normalize = function() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };
    return Point;
})();

var Particle = (function() {
    function Particle() {
        this.position = new positionPoint();

        this.velocity = new Point();
                this.acceleration = new Point();
        this.age = 0;
    }
    Particle.prototype.initialize = function(x, y, dx, dy) {
        this.position.x = x + weightedRandom(40, 2) - 20;
        this.position.y = y +  weightedRandom(40, 2) - 20;
        this.r = Math.random();
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    };
    Particle.prototype.update = function(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    };
    Particle.prototype.draw = function(context, image) {
        function ease(t) {
            return (--t) * t * t + 1;
        }
        var size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        //context.shadowColor = "red";
        //context.shadowBlur = 20;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    };
    return Particle;
})();


var ParticlePool = (function() {
    var particles,
        firstActive = 0,
        firstFree = 0,
        duration = settings.particles.duration;

    function ParticlePool(length) {
        particles = new Array(length);
        for (var i = 0; i < particles.length; i++)
            particles[i] = new Particle();
    }
    ParticlePool.prototype.add = function(x, y, dx, dy) {
        particles[firstFree].initialize(x, y, dx, dy);
        firstFree++;
        if (firstFree == particles.length) firstFree = 0;
        if (firstActive == firstFree) firstActive++;
        if (firstActive == particles.length) firstActive = 0;
    };
    ParticlePool.prototype.update = function(deltaTime) {
        var i;
        if (firstActive < firstFree) {
            for (i = firstActive; i < firstFree; i++)
                particles[i].update(deltaTime);
        }
        if (firstFree < firstActive) {
            for (i = firstActive; i < particles.length; i++)
                particles[i].update(deltaTime);
            for (i = 0; i < firstFree; i++)
                particles[i].update(deltaTime);
        }
        while (particles[firstActive].age >= duration && firstActive != firstFree) {
            firstActive++;
            if (firstActive == particles.length) firstActive = 0;
        }


    };
    ParticlePool.prototype.draw = function(context, image) {
        if (firstActive < firstFree) {
            for (i = firstActive; i < firstFree; i++)
                particles[i].draw(context, image);
        }
        if (firstFree < firstActive) {
            for (i = firstActive; i < particles.length; i++)
                particles[i].draw(context, image);
            for (i = 0; i < firstFree; i++)
                particles[i].draw(context, image);
        }
    };
    return ParticlePool;
})();

(function(canvas) {
    var context = canvas.getContext('2d'),
        particles = new ParticlePool(settings.particles.length),
        particleRate = settings.particles.length / settings.particles.duration,
        time;

    function pointOnHeart(t) {
        return new Point(
            200 * Math.pow(Math.sin(t), 3),
            150 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
    }

    var image = (function() {
        var canvas = document.createElement('canvas'),
            context= canvas.getContext('2d');
        canvas.width = settings.particles.size;
        canvas.height = settings.particles.size;
        function to(t) {
            var point = pointOnHeart(t);
            point.x = settings.particles.size / 3 + point.x * settings.particles.size / 550;
            point.y = settings.particles.size / 3 - point.y * settings.particles.size / 550;
            return point;
        }   
        context.beginPath();
        var t = -Math.PI;
        var point = to(t);
        let k = point.x;
        let d = point.y
        context.moveTo(k, k + d / 4);
        context.quadraticCurveTo(k, k, k + d / 4, k);
        context.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
        context.quadraticCurveTo(k + d / 2, k, k + d * 3/4, k);
        context.quadraticCurveTo(k + d, k, k + d, k + d / 4);
        context.quadraticCurveTo(k + d, k + d / 2, k + d * 3/4, k + d * 3/4);
        context.lineTo(k + d / 2, k + d);
        context.lineTo(k + d / 4, k + d * 3/4);
        context.quadraticCurveTo(k, k + d / 2, k, k + d / 4);
        context.closePath();

        context.fillStyle = '#F50F35';
        context.fill();

        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    })();

    function render() {
        requestAnimationFrame(render);
        var newTime = new Date().getTime() / 1000,
        deltaTime = newTime - (time || newTime);
        time = newTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
        var amount = particleRate * deltaTime;
        for (var i = 0; i < amount; i++) {
            var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            var dir = pos.clone().length(settings.particles.velocity);
            particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
        }
        particles.update(deltaTime);
        particles.draw(context, image);
    }
    function onResize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    window.onresize = onResize;
    
    setTimeout(function() {
        onResize();
        render();
    }, 512);


})(document.getElementById('heartAnimation'));
