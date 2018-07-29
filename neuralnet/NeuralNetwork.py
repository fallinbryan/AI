import numpy as np
import random
import json

class NeuralNetwork:
    '''
    :argument inputDimension: the number of expecting inputs into the network
    :argument hiddenLayers: a list defining the dimensions of the hidden layers
                [lyr1, lyr2, lyr3, .... lyrN]
    '''

    def __init__(self, input_dimension, hidden_layer_nodes, output_dimension):
        self.learningRate = 0.01
        self.weights = []
        # self.zetas = []
        self.bias = []
        self.outputs = []
        self.inputDimension = input_dimension
        self.outputDimension = output_dimension

        self.inputLayer = np.array([[0 for _ in range(input_dimension)]], dtype=float).transpose()
        prev_dimension = input_dimension
        for node in hidden_layer_nodes:
            self.bias.append(np.array([[random.random() for _ in range(node)]], dtype=float).transpose())
            self.weights.append(
                np.array([random.random() for _ in range(node * prev_dimension)],
                         dtype=float).reshape(node, prev_dimension)
            )
            prev_dimension = node

        self.bias.append(np.array([[random.random() for _ in range(output_dimension)]], dtype=float).transpose())
        self.weights.append(np.array(
            [random.random() for _ in range(prev_dimension * output_dimension)],
            dtype=float).reshape(output_dimension, prev_dimension))

    '''
    :argument input: an arry of size n defined in the constructor
    '''

    def predict(self, input_arr):
        output = None
        self.outputs.clear()
        self.inputLayer = np.array([input_arr], dtype=float).transpose()
        activate = np.vectorize(self.activate)
        current_input = np.copy(self.inputLayer)
        for i, weight_matrix in enumerate(self.weights):
            zeta = np.matmul(weight_matrix, current_input, ) + self.bias[i]
            # self.zetas.append(zeta)
            output = activate(zeta)
            self.outputs.append(output)
            current_input = output

        return output

    @staticmethod
    def activate(x):
        return 1 / (1 + np.exp(-x))

    @staticmethod
    def dactivate(x):
        return NeuralNetwork.activate(x) * (1 - NeuralNetwork.activate(x))

    @staticmethod
    def compute_gradient(results_vector, desired_vector, zeta):
        sigma_ddx = np.vectorize(NeuralNetwork.dactivate)
        ddZeta = sigma_ddx(zeta)
        gradient = (results_vector - desired_vector) * ddZeta
        return gradient

    def train(self, input_arr, target):
        # print(input_arr)
        target = np.array([target], dtype=float).transpose()
        self.predict(input_arr)
        sigma_ddx = np.vectorize(NeuralNetwork.dactivate)
        output = self.outputs.pop()
        error = target - output
        indicies = [i for i in reversed(range(len(self.weights)))]
        for index in indicies:
            gradient = error * sigma_ddx(output) * self.learningRate
            self.bias[index] += gradient
            try:
                deltas = np.matmul(gradient, self.outputs[-1].transpose())
            except:
                deltas = np.matmul(gradient, self.inputLayer.transpose())
                self.weights[index] += deltas
                return
            # print('weights[{}]\n{}\nDeltas:\n{}'.format(index,self.weights[index],deltas))
            self.weights[index] += deltas
            error = np.matmul(self.weights[index].transpose(), error)
            output = self.outputs.pop()

    def dump_network(self):
        _string = ''
        for i, matrix in enumerate(self.weights):
            _string += 'Weight Matrix[{}]:\n{}\n'.format(i, matrix)
        for i, bias in enumerate(self.bias):    
            _string += 'Bias[{}]:\n{}\n'.format(i,bias) 
        for i, output in enumerate(self.outputs):
            _string += 'Layer[{}]:\n{}\n'.format(i, output)
        return _string
    
    def toJSON(self):
        try:
            weights = [[list(w) for w in matrix] for matrix in self.weights ]
            json.dumps(weights)
        except:
            print('fail on weights',type(weights))
            print(weights)
            return None
        try:    
            biases = [[list(b) for b in matrix] for matrix in self.bias]
            json.dumps(biases)
        except:
            print('fail on biases',type(biases))
            return None
        try:
            layers = [[list(l) for l in matrix] for matrix in self.outputs]
            json.dumps(biases)
        except:
            print('fail on layers',type(layers))
            return None
            
        js_obj = {'weights':weights,'biases':biases,'layers':layers} 
        return json.dumps(js_obj)
        
    def __str__(self):
        return self.dump_network()

if __name__== '__main__':

    data = [{'target': [0, 0], 'input': np.array([0, 0])},
            {'target': [1, 0], 'input':  np.array([0, 1])},
            {'target': [1, 0], 'input':  np.array([1, 0])},
            {'target': [0, 0], 'input':  np.array([1, 1])}
            ]
    answers = [True, False]
    nn = NeuralNetwork(2, [3, 3], 2)
    print(nn.predict([1, 1]))
    print(answers[nn.predict([1, 1]).argmax()])

    [nn.train(data) for _ in range(100)]
    print(nn.predict([1, 1]))
    print(answers[nn.predict([1, 1]).argmax()])


    print(nn.test(data))


