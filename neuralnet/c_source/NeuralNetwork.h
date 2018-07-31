#ifndef NEURAL_NETWORK_H
#define NEURAL_NETWORK_H

#include <Eigen/Dense>
#include <string>
#include <vector>
#include <utility>
#include <sstream>

typedef unsigned short ushort; 

class NeuralNetwork {
  
 
private:
  double leargningRate;
  ushort inputDim;
  ushort outputDim;
  ushort numLayers; 
  std::vector<std::pair<ushort,ushort>*> layerDims; // [[w,h],[w,h],[w,h]].... 2d array defining layer dimensions
  Eigen::MatrixXd* weights;
  Eigen::VectorXd* outputs;
  Eigen::VectorXd* biases;
   
public: 
  NeuralNetwork(ushort inDim, std::vector<ushort> layers, ushort outDim, double learningRate);
  NeuralNetwork(std::string json);
  ~NeuralNetwork();
  Eigen::VectorXd predict();
  static double activate(double x);
  static double dactivate(double x);
  void train();
  std::stringstream toJSON();

};



#endif
