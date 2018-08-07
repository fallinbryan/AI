#include <iostream>
#include <Eigen/Dense>
#include <vector>
#include <utility>
#include <sstream>
#include <math.h>
#include "NeuralNetwork.h"


NeuralNetwork::NeuralNetwork(ushort inDim, std::vector<ushort>  layers, ushort outDim, double learningRate) {
  this->numLayers = layers.size() + 1; //for the output layer
  this->inputDim = inDim;
  this->outputDim = outDim;
  this->weights = new Eigen::MatrixXd[numLayers];
  this->outputs = new Eigen::VectorXd[numLayers];
  this->biases = new Eigen::VectorXd[numLayers];
  this->ffSentry = 0;
  this->bpSentry = 0;
  ushort prevDim = inDim;
  std::pair<ushort,ushort>* LDim = new std::pair<ushort,ushort>();
  LDim->second = inDim;
  for(int i = 0; i < numLayers-1; i++) {
    LDim->first = layers[i];
    layerDims.push_back(LDim);
    weights[i] = Eigen::MatrixXd::Random(LDim->first,LDim->second);
    biases[i] = Eigen::VectorXd::Random(LDim->first);
    outputs[i] = Eigen::VectorXd::Zero(LDim->first);
    LDim = new std::pair<ushort,ushort>();
    LDim->second = layers[i];
  }
  LDim->first = outDim;
  layerDims.push_back(LDim);
  weights[numLayers-1] = Eigen::MatrixXd::Random(LDim->first,LDim->second);
  biases[numLayers-1] = Eigen::VectorXd::Random(LDim->first);
  outputs[numLayers-1] = Eigen::VectorXd::Zero(LDim->first);

}

NeuralNetwork::~NeuralNetwork() {
  while(layerDims.size() > 0) {
    std::pair<ushort,ushort>* pPair = layerDims.back();
    delete pPair;
    pPair = nullptr;
    layerDims.pop_back();
  }

  delete[] weights;
  delete[] biases;
  delete[] outputs; 
}

NeuralNetwork::NeuralNetwork(std::string json) {
  
}

Eigen::VectorXd NeuralNetwork::predict(Eigen::VectorXd input) {
  Eigen::VectorXd prevInput = input;
  for(ffSentry = 0; ffSentry < numLayers; ffSentry++) {
          outputs[ffSentry] = weights[ffSentry]*prevInput + biases[ffSentry];
          //outputs[ffSentry] = outputs[ffSentry].unaryExpr( [](double x) { return (  1/(1+exp(-x)) ); } );
          outputs[ffSentry] = outputs[ffSentry].unaryExpr( [](double x) { return (activate(x)); } );
          prevInput = outputs[ffSentry];
  }
  
  return outputs[numLayers-1];
}

double NeuralNetwork::activate(double x) {
    x = -x;
    return 1/(1+exp(x));
}

double NeuralNetwork::dactivate(double x) {
    x = -x;
    double z = 1/(1+exp(x));
    return z*(1-z);
}

void NeuralNetwork::train() {

}

std::stringstream  NeuralNetwork::toJSON() {
  std::stringstream json;
  json << "{\"weights\":[";
  for(int m = 0; m < numLayers; m++) {
    json << "[";
    for(int row = 0; row < layerDims[m]->first; row++) {
      json << "[";
      for(int col = 0; col < layerDims[m]->second; col++) {
        if(col == layerDims[m]->second - 1) {
          json << weights[m](row,col);
        } else { 
          json << weights[m](row,col) << ",";
        }
      }
      if(row == layerDims[m]->first - 1) {
        json << "]";
      } else {
        json << "],";
      }
    }
    if(m == numLayers-1) {
       json << "]";
    } else {
      json << "],";
    }
  }
  json << "],\"biases\":[";
  for(int b = 0; b < numLayers; b++) {
    json << "[";
    for(int row = 0; row < layerDims[b]->first; row++) {
      if(row == layerDims[b]->first -1) {
        json << biases[b](row);
      } else {
        json << biases[b](row) << ",";
      }
    }
    if(b == numLayers -1) {
      json << "]";
    } else {
      json << "],";
    }
  }
  json << "]}";

  return json;
}






