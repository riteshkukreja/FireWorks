/**
 *	FireWorks JS
 *	Description: Generates firework effect on a given canvas with random colors.
 *	Author: RITESH KUKREJA
 *	Website: http://riteshkukreja.wordpress.com
 *	Github: https://github.com/riteshkukreja
 */
var FireWorks = function(config) {

	// if canvas element is not provided, create one and add to body
	var canvas;
	if(!config.canvas) {
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	} else {
		canvas = config.canvas;
	}

	// Retrieve 2d context
	var context = canvas.getContext("2d");

	// Default values for width and height are entire window
	var width = config.width || window.innerWidth;
	var height = config.height || window.innerHeight;

	// Generate random values between [min, max]: double
	var random = function(min, max) {
		return Math.random() * (max - min) + min;
	}

	// set background of canvas with given color
	// used to clear the canvas
	var Background = function(color) {
		if(context) {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	// Set the dimensions of the canvas with the given width and height
	var Dimension = function(width, height) {
		if(canvas) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	// Generate random RGB values: color
	var RandomColor = function() {
		return "rgb(" + Math.floor(random(0, 255)) + "," + Math.floor(random(0, 255)) + "," + Math.floor(random(0, 255)) + ")";
	}

	// Create a vector object with x and y positions
	// allow add(), subtract() and mult() between vectors
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
		var self = this;

		// add vector to the current vector
		this.add = function(vec) {
			self.x += vec.x;
			self.y += vec.y;
		}

		// subtract vector from the current vector
		this.subtract = function(vec) {
			self.x -= vec.x;
			self.y -= vec.y;
		}

		// multiply factor to the current vector
		this.mult = function(factor) {
			self.x *= factor;
			self.y *= factor;
		}

		// create a clone of the current vector and return it: vector
		this.clone = function() {
			return new Vector(self.x, self.y);
		}
	}

	// Create a particle object which goes up until the velocity becomes 0
	// @Param: position is used to provide the starting point
	// @Param: color of the particle
	// @Param: force is the accelaration of the particle
	// @Param: size of the particle
	// @Param: parallax to show parallax effect, far particles are smaller and slower
	// @Param: popped flag to create smaller particles after original particle is popped
	var Particle = function(pos, color, force, size, parallax, popped) {
		this.position = pos.clone();
		this.color = color;
		this.size = size || 3;

		this.velocity = new Vector(0, 0);
		this.acceleration = force.clone();
		this.damping = 0.9;

		this.done = false;
		this.popped = popped;
		this.popSpan = 20;

		var maxSize = 5;

		if(parallax) {
			this.damping *= (this.size / maxSize);
		}

		var self = this;

		// Update the position of the particle depending upon the gravity force
		this.update = function(gravity) {
			if(self.done) return;

			self.velocity.add(self.acceleration);
			self.velocity.mult(self.damping);

			if(!self.popped && self.velocity.y <= 0) {
				self.done = true;
			} else if(self.popped) {
				self.popSpan--;

				if(self.popSpan <= 0 )
					self.done = true;
			}

			self.position.subtract(self.velocity);
			self.acceleration.subtract(gravity);

		}

		// Draw the updated positions of the particle
		this.draw = function(context) {
			if(!self.done && context) {
				context.fillStyle = self.color;
				context.beginPath();
				context.arc(self.position.x, self.position.y, self.size, 0, Math.PI*2);
				context.fill();
			}
		}
	}

	// Create a particle system. It generates a single particle which when exploded, generates random number of smaller particles
	// @Param: parallax to show parallax effect, far particles are smaller and slower
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

	// Starting point of the application
	var app = function() {

		// set width and height of the application
		Dimension(width, height);

		// array to hold all the auto generated rocket objects
		var rockets = [];

		// Draw method to add rockets and draw their poition on the canvas
		var draw = function() {

			// to show the trailing effect of the rockets
			Background("rgba(0, 0, 0, .3)");

			// randomly add rockets to the array
			if(random(0, 1) < random(0.1, 0.5)) 
				rockets.push(new Rocket());

			// update and draw all the rockets
			for(var i = rockets.length-1; i >= 0; i--) {
				rockets[i].update();
				rockets[i].draw(context);

				// if a certain rocket is exploded, remove it from the list
				// dont forget or else the app will become very slow with time
				if(rockets[i].done) {
					rockets.splice(i, 1);
				}
			}

			// set it to 30 frames per second
			setTimeout(draw, 1000/30);
		}

		draw();
	}

	// Boom Boom 
	app();
}