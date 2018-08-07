


function NeuralNetwork(params) {
	this.weights = params.weights;
	this.biases = params.biases;
	this.activationFunction = params.activationFunction;
	this.categorize = function(inputVector) {
			var index = 0;
			var result = null;
			for(index = 0; index < this.weights.length; index++) {
				var weight = math.matrix(this.weights[index]);
				var bias = math.squeeze(this.biases[index]);
				result = math.multiply(weight, inputVector);
				result = math.add(result, bias);
				result = result.map(this.activationFunction)
				inputVector = result;
			}
			return result;
	}

}

function test() {
	i = [];
	for(var j = 0; j < 784; j++) {
		i.push(math.random())
	}
	r = nn.categorize(i)
	return r._data;
}


function refreshCanvas(params) {
	var style = params.ctx.fillStyle;
  params.ctx.stroke();
  params.ctx.clearRect(0,0,params.width, params.height);
	params.ctx.fillStyle = 0x000000;
	params.ctx.fillRect(0,0,params.width, params.height);
	params.ctx.fillStyle = style;
}

var nn;
var answerKey = [0,1,2,3,4,5,6,7,8,9];

$(document).ready(function () {
	var mouseIsDownOnCanvas = false;
	var prevX = 0;
	var currX = 0;
	var prevY = 0;
	var currY = 0;
	var canvas = $('#inputCanvas');
	var ctx = canvas[0].getContext('2d');
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	var canvasParams = {
		'ctx':ctx,
		'width':canvas.width(),
		'height':canvas.height()
	}

	refreshCanvas(canvasParams);

	$(canvas).mousedown(function(event) {
		mouseIsDownOnCanvas = true;
		currX = event.offsetX;
		currY = event.offsetY;
	});

	$(canvas).mouseup(function() {
		mouseIsDownOnCanvas = false;
	});

	$(canvas).mouseleave(function() {
		mouseIsDownOnCanvas = false;
	});

	$(canvas).mousemove(function(event) {
		if(mouseIsDownOnCanvas) {

		  ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 10;
			prevX = currX;
			prevY = currY;
			currX = event.offsetX;
			currY = event.offsetY;
			ctx.beginPath();
		  ctx.moveTo(prevX, prevY);
			ctx.lineTo(currX, currY);
			ctx.stroke();
			ctx.closePath();
	  }

	});

	$('#clearCanvas').click(function() {
		refreshCanvas(canvasParams)
	});

	$('#categorize').click(function() {
		//ctx.scale(0.1,0.1)
	  var newCanvas = $('<canvas>')
					.attr('width', canvas.width())
					.attr('height', canvas.height())[0];
		$('#controls').append(newCanvas);
		newctx = newCanvas.getContext('2d');
		img = ctx.getImageData(0,0,canvas.width(), canvas.height());
		newctx.putImageData(img,0,0);
		newctx.scale(0.1,0.1);
		var newcanvasParams = {
			'ctx':newctx,
			'width':canvas.width(),
			'height':canvas.height()
		}
		refreshCanvas(newcanvasParams);
		newctx.drawImage(newCanvas,0,0);
		img = newctx.getImageData(0,0,28,28).data;
		$(newCanvas).remove();
		raw = [];
		for(var i = 0; i < img.length; i+=4) {
			raw.push((img[i]/255.0))
		}
		var guess = nn.categorize(raw);
		guess = guess._data;
		result = answerKey[guess.indexOf(Math.max(...guess))];
		$('#result').text(result);

	});

	$.getJSON('neuralnet/mnistTrained80percent.json', function(json) {
	  var neuralNet = new NeuralNetwork(json);
		neuralNet.activationFunction = function(x) { return x/(x+math.exp(x)); }
		nn = neuralNet;
	});


});
