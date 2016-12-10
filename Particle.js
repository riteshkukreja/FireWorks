/**
 *	Particle JS
 *	Description: Create a particle object which goes up until the velocity becomes 0
		@Param: position is used to provide the starting point
		@Param: color of the particle
		@Param: force is the accelaration of the particle
		@Param: size of the particle
		@Param: parallax to show parallax effect, far particles are smaller and slower
		@Param: popped flag to create smaller particles after original particle is popped
 *	Author: RITESH KUKREJA
 *	Website: http://riteshkukreja.wordpress.com
 *	Github: https://github.com/riteshkukreja
 */

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

	this.draw = function(context) {
		if(!self.done && context) {
			context.fillStyle = self.color;
			context.beginPath();
			context.arc(self.position.x, self.position.y, self.size, 0, Math.PI*2);
			context.fill();
		}
	}

}