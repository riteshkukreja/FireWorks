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