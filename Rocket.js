/**
 *	Rocket JS
 *	Description: Create a particle system. It generates a single particle which when exploded, generates random number of smaller particles
 		@Param: parallax to show parallax effect, far particles are smaller and slower
 *	Author: RITESH KUKREJA
 *	Website: http://riteshkukreja.wordpress.com
 *	Github: https://github.com/riteshkukreja
 */

var Rocket = function(parallax) {
	this.popped = false;
	this.done = false;
	this.gravity = new Vector(0, 0.05);

	this.stars = [];
	this.color = RandomColor();
	this.parallax = parallax;

	this.particle = new Particle(new Vector(random(0, canvas.width), canvas.height), this.color, new Vector(random(-0.5, 0.5), random(1, 3)), random(1, 5), this.parallax);

	// Update the position of the particle or smaller particles if the original particle is destroyed
	this.update = function() {
		if(this.done) return;

		if(!this.popped) {
			this.particle.update(this.gravity);

			if(this.particle.done) {
				this.popped = true;

				var Len = random(1, 100);
				for(var i = 0; i < Len; i++) {
					this.stars.push(
						new Particle(
							this.particle.position,
							this.color,
							new Vector(random(-2, 2), random(-1, 2)),
							1,
							false,
							true
						));
				}
			}
		} else if(this.stars.length === 0) {
			this.done = true;
			this.gravity.mult(0.1);
		} else {
			for(var i = this.stars.length-1; i >= 0; i--) {
				this.stars[i].update(this.gravity);

				if(this.stars[i].done) {
					this.stars.splice(i, 1);
				}
			}
		}
	}

	// Draw the orignal particle if exists else draw the smaller particles for a lmited lifespan
	this.draw = function(context) {
		if(this.done) return;

		if(!this.popped) {
			this.particle.draw(context);
		} else {
			for(var i = this.stars.length-1; i >= 0; i--) {
				this.stars[i].draw(context);
			}
		}
	}

}