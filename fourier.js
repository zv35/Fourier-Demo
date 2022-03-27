var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;

// Settings
var fps = 24;
var speed = 3600;
var graphSpacing = 2;
var linePoints   = 400;
ctx.lineWidth = 1.5;


var line    = [0];
var circles = [];



function updateView(){
	var scale = document.getElementById("scale").value / 100;
	graphSpacing = scale;
	linePoints = 800/scale;
	while (line.length > linePoints){line.shift()}
	
	speed = document.getElementById("speed").value;
}
function updateSliders(){
	circleSelect = circles[document.getElementById("circleSelect").selectedIndex]
	document.getElementById("frequency").value = circleSelect.frequency;
	document.getElementById("amplitude").value = circleSelect.amplitude;
	document.getElementById("phase").value = circleSelect.phase;
}
function loadPreset(){
	var custom = document.querySelector(".custom");
	custom.style.visibility = "hidden";
	switch(document.getElementById("presetSelect").value){
		case "Custom":
			custom.style.visibility = "";
			circles = [{amplitude: 100, frequency: 30, phase: 0, center: {x: canvas.height/2, y: canvas.height/2}}];
			break;
		case "Descending":
			circles = [{amplitude: 100, frequency: 100, phase: 0, center: {x: canvas.height/2, y: canvas.height/2}}];
			for (let i = 2; circles.length < 6; i++){
				circles.push({amplitude: 100/i, frequency: 100/i, phase: 0})
			}
			break;
		case "Descending - linear":
			circles = [{amplitude: 80, frequency: 100, phase: 0, center: {x: canvas.height/2, y: canvas.height/2}}];
			for (let i = 1; circles.length < 6; i++){
				circles.push({amplitude: 80-i*13, frequency: 100-i*10, phase: 0})
			}
			break;
		case "Random - 5":
			circles = [{amplitude: Math.random()*150, frequency: Math.random()*500, phase: Math.random()*Math.PI, center: {x: canvas.height/2, y: canvas.height/2}}];
			for (let i=1; i < 5; i++){
				circles.push({amplitude: Math.random()*100, frequency: Math.random()*600, phase: Math.random()*Math.PI});
			}
			break;
		case "Random - 10":
			circles = [{amplitude: Math.random()*100, frequency: Math.random()*450, phase: Math.random()*Math.PI, center: {x: canvas.height/2, y: canvas.height/2}}];
			for (let i=1; i < 10; i++){
				circles[i] = {amplitude: Math.random()*80, frequency: Math.random()*600, phase: Math.random()*Math.PI};
			}
			break;
	}
}
function updateCircle(){
	circles[document.getElementById("circleSelect").selectedIndex]  = {
		frequency: document.getElementById("frequency").value,
		amplitude: document.getElementById("amplitude").value,
		phase: document.getElementById("phase").value / 100 * Math.PI,
		center: circles[document.getElementById("circleSelect").selectedIndex].center
	}
}
function removeCircle(){
	if(circles.length > 1){
		circles.pop();
		let circleSelect = document.getElementById("circleSelect");
		circleSelect.remove(circleSelect.length - 1);
	}
	updateSliders();
}
function addCircle(){
	circles.push({
		amplitude:75,
		frequency:50,
		phase:0
	});
	
	var option = document.createElement('option');
    option.text = option.value = circles.length;
    
    var circleSelect = document.getElementById("circleSelect");
	circleSelect.add(option, circleSelect.options.length);
}; addCircle();
circles[0] = {amplitude: 100, frequency: 30, phase: 0, center: {x: canvas.height/2, y: canvas.height/2}};
updateSliders();


var counter = 0;
setInterval(function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "#000"
	for (let i=0; i < circles.length; i++){

		// Drawing circle
		ctx.beginPath();
		ctx.arc(circles[i].center.x, circles[i].center.y, circles[i].amplitude, 0, 2 * Math.PI);
		ctx.stroke()


		// Finding outer point
		var outerPoint = {
			x: circles[i].center.x + circles[i].amplitude * Math.cos(counter * circles[i].frequency + circles[i].phase),
			y: circles[i].center.y + circles[i].amplitude * Math.sin(counter * circles[i].frequency + circles[i].phase)
		}

	
		
		ctx.beginPath();
		if (i == circles.length - 1){
			line.push(outerPoint);
			ctx.fillStyle = "#0F0";
			ctx.arc(outerPoint.x, outerPoint.y, 3, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			circles[i+1].center = outerPoint;
		}
		// Crawing center point
		ctx.fillStyle = "#F00";
		ctx.beginPath();
		ctx.arc(circles[i].center.x, circles[i].center.y, 3, 0, 2 * Math.PI);
		ctx.fill();
		
	}
	

	if (line.length >= linePoints){line.shift();}
	
	ctx.strokeStyle = "#0AF"
	ctx.beginPath();
	ctx.moveTo(line[line.length - 1].x, line[line.length - 1].y)
	//ctx.moveTo(canvas.height/2 + circles[0].amplitude + 6, canvas.height/2);
	for (let i=line.length-1; i > 0; i--){
		ctx.lineTo(canvas.width - i * graphSpacing, line[i].y)
	}

	ctx.stroke();
	
	counter += Math.PI / speed;
}, 1/fps*1000);
