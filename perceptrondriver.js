



$(document).ready(function () {
	var canvas = $('#theCanvas');
	var ctx = canvas[0].getContext('2d');
	var width = canvas.width()
	var height = canvas.height()			
	var params = {
			vectorSpace:2,
			learningRate:0.0001,
			bias:1,
			activationFunction:activate,
			//weights:[Math.random(), Math.random(), Math.random()]
			weights:[0,0,0]
		};
		
	var perceptron = new Perceptron(params);
	var trainData = null;
	var currentDataIndex = 0;
	var numCorrect = 0;
	

	ctx.fillStyle = '#e0e0eb';
	ctx.fillRect(0,0,width,height);
	ctx.translate(0,height);
	height = -height;
	
	ctx.moveTo(0,0);
	ctx.lineTo(width, height);
	ctx.stroke();
	
	
	
	$('#theCanvas').mousemove(function(event) {
		var pos = $('#canvasParent').position();
		var x = event.pageX - pos.left-14.5;
		var y =  $(this).height() - (event.pageY-pos.top)
		$('#mousecoords').html(`<i>(${x},${y})</i>`);
	});
	
	$('#genData').click(function() {
		var x = 0;
		var y = 1;
		var radius = 10;
		var point;
		
		trainData = generateDataSet(2, 50, width-radius);
		for(var i=0; i < trainData.data.length; i++) {
			point = trainData.data[i];
			if(point[x] <= point[y]) {
				ctx.strokeStyle = '#ff6347';
			} else {
				ctx.strokeStyle = '#87ceeb';
			}
			drawCircle(ctx, point[x], -point[y], radius)			
		}
		
		$(this).attr('disabled','disabled');
		$('#stepLearn').removeAttr('disabled');
		$('#playLearn').removeAttr('disabled');
	});
	
	$('#stepLearn').click(function() {
		var radius = 6;
		
		if(currentDataIndex == trainData.labels.length) {
			var accuracy = (numCorrect / trainData.labels.length)*100;
			alert(`Cycle Complete with ${accuracy}% accuracy\n resetting to first data point`);
			currentDataIndex = 0;
			numCorrect = 0;
			ctx.fillStyle = '#ffffff';
			for(var i = 0; i < trainData.labels.length; i++) {
				var j = trainData.data[i][0];
				var k = trainData.data[i][1];
				fillCircle(ctx,j,-k,radius);
			}
		}
		var predicted = perceptron.predict(trainData.data[currentDataIndex]);
		//console.log(`guess: ${predicted}, lable: ${trainData.labels[currentDataIndex]}`);
		var x = trainData.data[currentDataIndex][0];
		var y = trainData.data[currentDataIndex][1];
		var radius = 6;
		if (predicted == trainData.labels[currentDataIndex]) {
			ctx.fillStyle = '#00ff00';
			numCorrect++;
		} else {
			ctx.fillStyle = '#ff0000';
		}
		fillCircle(ctx,x,-y,radius);
		console.log(trainData.data[currentDataIndex]);
		perceptron.stepTrain(trainData.labels[currentDataIndex],
						 trainData.data[currentDataIndex]);
						 
		
		currentDataIndex++;
	})
	
	$('#playLearn').click(function() {
		
		var timer = setInterval( function() {
			var accuracy = 0;
			var radius = 6;
			
			for(var i = 0; i < trainData.data.length; i++) {
				var guess = perceptron.predict(trainData.data[i]);
				if(guess == trainData.labels[i]) {
					accuracy++;
					ctx.fillStyle = '#00ff00';
					numCorrect++;
				} else {
					ctx.fillStyle = '#ff0000';
				}
				var x = trainData.data[i][0];
				var y = trainData.data[i][1];
				fillCircle(ctx,x,-y,radius);
			}
			accuracy = (accuracy / trainData.data.length) * 100;
			$('#mousecoords').html(`<i>Accurcy: ${accuracy}%</i>`);
			if(accuracy >= 100) {
				console.log('met accuacyt');
				clearInterval(timer);
			}
			
			for(var i=0; i < 10001; i++) {
				perceptron.train(trainData.labels, trainData.data);
			}
		}, 100);
		
	});
	
});

function drawCircle(context,x,y,radius) {
	context.beginPath();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI)
	context.stroke();
}

function fillCircle(context, x, y, radius) {
	context.beginPath();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI)
	context.fill();
}