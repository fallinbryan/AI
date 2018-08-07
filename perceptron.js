
function Perceptron(params) {
	this.vectorSpace = params.vectorSpace;
	this.learningRate = params.learningRate;
	this.bias = params.bias;
	this.activationFunction = params.activationFunction;
	this.weights = params.weights;
	this.predict = function(inputSource) {
		if(inputSource.length != this.vectorSpace) {
			throw `invalid source dimension for this perceptron, expecting ${this.vectorSpace}`;
		}
		var prediction;
		var sum = 0;
		var lastIndex = inputSource.length;
		var i = 0;
		for(i=0; i < lastIndex; i++) {
			sum += inputSource[i] * this.weights[i];
		}
		sum += this.bias * this.weights[lastIndex];
		prediction = this.activationFunction(sum);
		return prediction;
	}
	
	this.train = function(labels, trainingSet) {
		var size = trainingSet.length;
		var i = 0;
		var prediction = null;
		var correct = 0;
		for(i=0; i < size; i++) {
			correct++;
			prediction = this.predict(trainingSet[i]);
			if(prediction != labels[i]) {
				correct--;
				this.backPropogate(labels[i] - prediction, trainingSet[i]);
			}
		}
		return correct/size;
	}
	
	this.stepTrain = function(label, trainingSet) {
		var prediction =  this.predict(trainingSet);
		if(prediction != label) {
			this.backPropogate(label - prediction, trainingSet);	
		}
	}
	
	this.demoStepTrain = function(label, trainingInstance) {
		console.log(`demoStepTrain(label::${label}, trainingInstance::${trainingInstance}`)
		var prediction = this.predict(trainingInstance);
		console.log(`demoStepTrain::prediction = ${prediction}`)
		var isAccurate;
		if(prediction != label) {
			isAccurate = false;
			this.backPropogate(label - prediction, trainingInstance)
		} else {
			isAccurate = true;
		}
		return isAccurate;
	}
	
	this.backPropogate = function(error, inputs) {
		var i;
		for(i = 0; i < inputs.length; i++) {
			this.weights[i] += error * inputs[i] * this.learningRate;
		}
		this.weights[inputs.length] += error * this.learningRate;
	}	
}

function activate(sum) {
	return Math.sign(sum);
}

var weights = [];
for(var i = 0; i <=3; i++) {
	weights.push(Math.random());
}


function generateDataSet(vectorSpace, size, range,) {
	var labels = [];
	var trainingSet = [];
	for(var i=0; i < size; i++) {
		trainingSet.push([]);
		for(var j=0; j < vectorSpace; j++) {
			trainingSet[i].push(Math.floor(randRange(0,range)));
		}
		if(trainingSet[i][0] <= trainingSet[i][1]) {
			labels.push(-1);
		} else {
			labels.push(1);
		}
	}
	return {labels:labels, data:trainingSet }
}


function train(trainData, perceptron) {
	var labels = trainData.labels;
	var trainingSet = trainData.data;
	var accuracy = perceptron.train(labels, trainingSet)
	return accuracy
}

function testAccuracy(data, perceptrion) {
	var labels = data.labels;
	var dataSet = data.data;
	var correct = 0;
	for(var i=0; i < labels.length; i++) {
		if(perceptron.predict(dataSet[i]) == labels[i]) {
			correct++;
		}
		
	}
	return correct / labels.length;
}

function testTrain(perceptron) {
	var label;
	var trainingInstance = [];
	for(var i =0; i < perceptron.vectorSpace; i++) {
		trainingInstance.push(randRange(0,10));
	}
	if(trainingInstance[0] <= trainingInstance[1]) {
			label = 1;
		} else {
			label = -1;
		}
	console.log(`Perceptron was accurate?: ${perceptron.demoStepTrain(label, trainingInstance)}`)
}

function randRange(min, max) {
	return Math.random() * (max - min) + min;
}


function iteratedTrainingRun(perceptron, target_accuracy, maxiterations) {
	var trainSetSize = 10;
	var iterations = 0;
	var train_data = generateDataSet(trainSetSize);
	var test_data = generateDataSet(100000);

	while(testAccuracy(test_data, perceptron) < target_accuracy && iterations <= maxiterations) {
		while(train(train_data, perceptron) < target_accuracy && iterations <= maxiterations) {
			iterations++;
			
		}
		trainSetSize++;
		train_data = generateDataSet(trainSetSize);
	}
	if(iterations >= maxiterations) {
		console.log(`Failed to reach convergence by ${iterations} iterations`);
	} else {
		console.log(`Convergence achieved, perceptron is trained in ${iterations} iterations`);
	}
	
}
