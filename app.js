/**
 *	APP JS
 *	Description: Starting point of the FireWorks application
 *	Author: RITESH KUKREJA
 *	Website: http://riteshkukreja.wordpress.com
 *	Github: https://github.com/riteshkukreja
 */

// Get the canvas element an its context
var canvas = document.getElementById("can");
var context = canvas.getContext("2d");

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