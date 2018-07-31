#include <vector>
#include <iostream>
#include <string>
#include <fstream>
#include "NeuralNetwork.h"




int main(int argc, char** argv) {
  std::vector<ushort> layers = {4, 2};
  NeuralNetwork NN(3,layers,2,0.1);
  std::string json;
  NN.toJSON() >> json;
  std::ofstream jfile;
  jfile.open("nn.json");
  jfile << json;
  jfile.close();
  std::cout << json << std::endl;
}
