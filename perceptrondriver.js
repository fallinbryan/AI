



$(document).ready(function () {
	var canvas = $('#theCanvas');
	var ctx = canvas[0].getContext('2d');
	var width = canvas.width()
	var height = canvas.height()	
		
	var perceptron = null;
	var trainData = null;
	var currentDataIndex = 0;
	var numCorrect = 0;
	
	var dataPointSliderValue = 20;
	

	var aStyle = '#ff6347';
	var bStyle = '#87ceeb';
	var canvasParams = {ctx:ctx, width:width, height:height};
	
	ctx.translate(0,height);
	height = -height;
	refreshCanvas(canvasParams);	

  $('#theCanvas').on({'touchstart': function(event){
   
		//console.log('canvas clicked');
		
		var pos = $('#canvasParent').position();
		var x = event.pageX - pos.left-14.5;
		var y =  $(this).height() - (event.pageY-pos.top)
		if(!(perceptron === null)) {
			var guess = perceptron.predict([x,y])
			console.log(`guess: ${guess}`)
			if(guess == -1) {
				ctx.fillStyle = aStyle;
				fillCircle(ctx,x,-y,10);
			} else if(guess == 1) {
				ctx.fillStyle = bStyle;
				fillCircle(ctx,x,-y,10);
			}
		}
  }});
	
	$('#theCanvas').click(function(event) {
		//console.log('canvas clicked');
		
		var pos = $('#canvasParent').position();
		var x = event.pageX - pos.left-14.5;
		var y =  $(this).height() - (event.pageY-pos.top)
		if(!(perceptron === null)) {
			var guess = perceptron.predict([x,y])
			//console.log(`guess: ${guess}`)
			if(guess == -1) {
				ctx.fillStyle = aStyle;
				fillCircle(ctx,x,-y,10);
			} else if(guess == 1) {
				ctx.fillStyle = bStyle;
				fillCircle(ctx,x,-y,10);
			}
		}
		
	});
	
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
		refreshCanvas(canvasParams);	
		trainData = generateDataSet(2, dataPointSliderValue, width-radius);
		for(var i=0; i < trainData.data.length; i++) {
			point = trainData.data[i];
			if(point[x] <= point[y]) {
				ctx.fillStyle = aStyle;
			} else {
				ctx.fillStyle = bStyle;
			}
			fillCircle(ctx, point[x], -point[y], radius)			
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
		//console.log(trainData.data[currentDataIndex]);
		perceptron.stepTrain(trainData.labels[currentDataIndex],
						 trainData.data[currentDataIndex]);
						 
		
		currentDataIndex++;
	})
	
	var timer = null;
	
	$('#playLearn').click(function() {
		//console.log(perceptron);
		if(!(perceptron === null)) {
			timer = setInterval( function() {
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
        
        //drawLine(ctx ,0 ,width, perceptron );
				accuracy = (accuracy / trainData.data.length) * 100;
				$('#mousecoords').html(`<i>Accuracy: ${accuracy}%</i>`);
				if(accuracy >= 100) {
					//console.log('met accuacyt');
					clearInterval(timer);
					$('#genData').removeAttr('disabled');
					$('#playLearn').attr('disabled','disabled');
					$('#stepLearn').attr('disabled','disabled');
				}
				
				for(var i=0; i < 10001; i++) {
				  if(perceptron.train(trainData.labels, trainData.data) ==1) {
            break;
          }
				}
			}, 100);
		}
		
	});

	
	var xWeightValue = 0;
	var yWeightValue = 0;
	var biasWeightValue = 0;
	var learningRateValue = 0.001;
	
	
	var dpSlider = $('#dataPoints')[0];
	dpSlider.oninput =  function() {
		$('#dataPointValue')[0].innerHTML = this.value;
		dataPointSliderValue = parseFloat(this.value);
	}
	var xWeight = $('#xWeight')[0];
	xWeight.oninput =  function() {
		$('#xWeightValue')[0].innerHTML = this.value;
		xWeightValue = parseFloat(this.value);
	}
	var yWeight = $('#yWeight')[0];
	yWeight.oninput =  function() {
		$('#yWeightValue')[0].innerHTML = this.value;
		yWeightValue = parseFloat(this.value);
	}
	var biasWeight = $('#biasWeight')[0];
	biasWeight.oninput =  function() {
		$('#biasWeightValue')[0].innerHTML = this.value;
		biasWeightValue = parseFloat(this.value);
	}
	
	var learningRate = $('#learningRate')[0];
	learningRate.oninput =  function() {
		$('#learningRateWeightValue')[0].innerHTML = this.value;
		learningRateValue = parseFloat(this.value);
	}
	
	
	
	$('#reset').click(function() {
		refreshCanvas(canvasParams);
		clearInterval(timer);
		perceptron = null;
		trainData = null;
		$('#generatePerceptron').removeAttr('disabled');
		$('#genData').attr('disabled','disabled');
		$('#playLearn').attr('disabled','disabled');
		$('#stepLearn').attr('disabled','disabled');
	});
	
	$('#clearCanvas').click(function() {
		refreshCanvas(canvasParams);
		
	});
	
	
	
	$('#generatePerceptron').click(function() {
		perceptron = new Perceptron ({
			vectorSpace:2,
			learningRate:$('#learningRate')[0].value,
			bias:1,
			activationFunction:activate,
			weights:[xWeightValue,
					yWeightValue,
					biasWeightValue]
		});
		$(this).attr('disabled','disabled');
		$('#genData').removeAttr('disabled');
		
		//console.log(perceptron);
		
	});
});

function drawCircle(context,x,y,radius) {
  context.save();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI)
	context.closePath();
  context.stroke();
  context.restore();
}

function fillCircle(context, x, y, radius) {i
  context.save();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI)
	context.closePath();
  context.fill();
  context.restore();
}

function refreshCanvas(params) {
	var style = params.ctx.fillStyle;
  params.ctx.stroke();
  params.ctx.clearRect(0,0,params.width, -params.height);
	params.ctx.fillStyle = '#e0e0eb';
	params.ctx.fillRect(0,0,params.width,-params.height);
  params.ctx.strokeStyle = '#000000';
 	params.ctx.moveTo(0,0);
	params.ctx.lineTo(params.width, -params.height);
	params.ctx.stroke();
	params.ctx.fillStyle = style;
}

function drawLine(context,x1 ,x2 ,percep ) {
  context.moveTo(x1, -getLineFrom(x1, percep));
  context.lineTo(x2, -getLineFrom(x2, percep));
  context.stroke();
}

function getLineFrom(x, p) {
  var w1 =  p.weights[0];
  var w2 =  p.weights[1];
  var w3 =  p.weights[2];
  var y = -((x*w1 + w3)/w2);
  
  return y;
}
















