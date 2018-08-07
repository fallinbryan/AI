var express = require('express');
var app = express();
var path = require('path');
//var APIKey = getAPIKey();

//function getAPIKey() {
//  var fs = require('fs');
//  var filePath = path.join(__dirname, 'clashAPI/api.key');
//  var data = fs.readFileSync(filePath, {encoding: 'utf-8'});
//  return data;
//}


app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname+'/index.html')); //__dirname resolves to project folder
});

app.get('/AI',function(request, response) {
  response.sendFile(path.join(__dirname+'/index.html'));
});

//app.get('/COC', function(request, response) {
//  response.sendFile(path.join(__dirname+'/clashAPI/clan.html'));
//});

//app.get('/clan.json', function(request, response) {
//  response.setHeader('Content-Type','application/javascript');
//  response.sendFile(path.join(__dirname+'/clashAPI/clan.json'));
//});


//app.get('/player', function(request, response) {
//  response.setHeader('Content-Type', 'application/json');
//  var tag = request.query.tag;
//  var Client = require('node-rest-client').Client;
//  var client = new Client();
//  var url = 'https://api.clashofclans.com/v1/players/' + tag.replace('#','%23');
//  var key = getAPIKey();
//  key = key.replace(/^\s+|\s+$/g, '');

//  var args = {
//    headers: {
//      'accept': 'application/json',
//      'authorization': 'Bearer ' + key  } };

//  client.get(url, args, function (data, resp){
//    response.send(data);
//  });
//});


//app.get('/clan', function(request, response) {
//  console.log('request for clan data initiated');
//  response.setHeader('Content-Type','application/json');
//  var tag = request.query.tag;
//  var Client = require('node-rest-client').Client;
//  var client = new Client();
//  var url = 'https://api.clashofclans.com/v1/clans/' + tag.replace('#','%23') ;
//  var key = getAPIKey();
//  key = key.replace(/^\s+|\s+$/g, '');
//  var args = {
//    headers: {
//      'accept': 'application/json',
//      'authorization': 'Bearer ' + key  } };
///
//
//  client.get(url, args, function (data, resp){
//    response.send(data);
//  });
//
//});

//app.get('/players.json', function(request, response) {
//  response.setHeader('Content-Type','application/javascript');
//  response.sendFile(path.join(__dirname+'/clashAPI/players.json'));
//});

//app.get('/clan.js', function(request, response) {
//  response.setHeader('Content-Type','application/javascript');
//  response.sendFile(path.join(__dirname+'/clashAPI/clan.js'));
//});

app.get('/perceptron', function(request, response) {
  response.sendFile(path.join(__dirname+'/perceptron.html'));
});

app.get('/perceptron.js', function(request, response) {
  response.setHeader('Content-Type','application/javascript');
  response.sendFile(path.join(__dirname+'/perceptron.js'));
});

app.get('/neural_network', function(request, response) {
  response.sendFile(path.join(__dirname+'/neuralnet/index.html'));
});

app.get('/math.min.js', function(request, response) {
  response.setHeader('Content-Type','applicatiton/javascript');
  response.sendFile(path.join(__dirname+'/neuralnet/math.min.js'));
});

app.get('/NeuralNetwork.js', function(request, response) {
  response.setHeader('Content-Type','applicatiton/javascript');
  response.sendFile(path.join(__dirname+'/neuralnet/NeuralNetwork.js'));
});
app.get('/neuralnet/mnistTrained80percent.json', function(request, response) {
  response.setHeader('Content-Type','applicatiton/javascript');
  response.sendFile(path.join(__dirname+'/neuralnet/mnistTrained80percent.json'));
});


app.get('/perceptrondriver.js', function(request, response) {
  response.setHeader('Content-Type','applicatiton/javascript');
  response.sendFile(path.join(__dirname+'/perceptrondriver.js'));
});

app.get('/jquery-filled.png', function(request, response) {
  response.sendFile(path.join(__dirname+'/jquery-filled.png'));
});

app.get('/Boostrap_logo.svg', function(request, response) {
  response.sendFile(path.join(__dirname+'/Boostrap_logo.svg'));
});

app.get('/JAVAScript-collector.png', function(request, response) {
  response.sendFile(path.join(__dirname+'/JAVAScript-collector.png'));
});

app.get('/perceptron_bg.jpg', function(request, response) {
  response.sendFile(path.join(__dirname+'/perceptron_bg.jpg'));
});

app.listen(3000);


//getClanJSON('%232UPGPLYQ');
//console.log("Running on port 3000");
