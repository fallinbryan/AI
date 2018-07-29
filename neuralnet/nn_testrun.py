from NeuralNetwork import NeuralNetwork as NN
import random

nn = NN(2,[2,3,5],2)

data = [{'target':[0.8,0.4], 'input':[0.8,0.1]},
        {'target':[0.8,0.4], 'input':[0.1,0.8]},
        {'target':[0.4,0.8], 'input':[0.8,0.8]},
        {'target':[0.4,0.8], 'input':[0.1,0.1]} ]

for _ in range(10000):
  random.shuffle(data)
  for dat in data:
    nn.train(dat['input'],dat['target'])

answerkey = [True,False]
print('True XOR True = {}'.format(answerkey[nn.predict([0.8,0.8]).argmax()]))
print('True XOR False = {}'.format(answerkey[nn.predict([0.8,0.1]).argmax()]))
print('False XOR True = {}'.format(answerkey[nn.predict([0.1,0.8]).argmax()]))
print('False XOR False = {}'.format(answerkey[nn.predict([0.1,0.1]).argmax()]))
