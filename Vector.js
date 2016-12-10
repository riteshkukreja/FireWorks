/**
 *	Vector JS
 *	Description: Create a vector object with x and y positions. Allow add(), subtract() and mult() between vectors
 *	Author: RITESH KUKREJA
 *	Website: http://riteshkukreja.wordpress.com
 *	Github: https://github.com/riteshkukreja
 */
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