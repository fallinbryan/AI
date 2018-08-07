#!/usr/bin/env python3


from NeuralNetwork import NeuralNetwork as NN
import sys
import json
import random
import MNIST
import numpy as np
import logging

logging.basicConfig(format='%(levelname)s : %(asctime)s : %(message)s',
  filename='train.log', level=logging.DEBUG)

normalize = np.vectorize(lambda x: np.float(x/255.0))

nn = NN(28*28,[int((28*28)/2),20],10)
nn.learingRate = 0.15
answerkey = [0,1,2,3,4,5,6,7,8,9]
train_images =  MNIST.get_images('mnist/train-images-idx3-ubyte')
test_images  =  MNIST.get_images('mnist/t10k-images-idx3-ubyte')
train_labels =  MNIST.get_labels('mnist/train-labels-idx1-ubyte')
test_labels  =  MNIST.get_labels('mnist/t10k-labels-idx1-ubyte')

if( train_images is None or test_images is None or train_labels is None or test_labels is None):
  raise Exception('Retrieved Data is NONE')  
 


test_data = []
train_data = []

data_amount = len(train_images)
for i in range(data_amount):
    label=[0,0,0,0,0,0,0,0,0,0]
    label[train_labels[i]]=1
    train_data.append({'input':train_images[i],'target':label})
    
data_amount = len(test_images)   
for i in range(data_amount):
    label=[0,0,0,0,0,0,0,0,0,0]
    label[test_labels[i]]=1
    test_data.append({'input':test_images[i],'target':label})

def train():
    random.shuffle(train_data)
    counter = 0;
    total = len(train_data)
    for data in train_data:
        nn.train(normalize(data['input']),data['target'])
        counter += 1
#        print('{0:.2%} complete'.format(counter/total),end='\r')
    nn.predict(train_data[0]['input'])
        

def test():
    num_correct = 0
    counter = 0
    total = len(test_data)
    for data in test_data:
        prediction = nn.predict(normalize(data['input'])).argmax()
        if data['target'].index(1) == prediction:
            num_correct += 1
        counter += 1;
#        print('{0:.2%} completed     '.format(counter/total),end='\r')
    score = num_correct / total
#    print('{} out of {} correct'.format(num_correct,total))
    return score

def slope(d_list):
    if len(d_list) < 10:
        return 1
    else:
        return np.average(np.gradient(d_list))
        
def dump_score(score):
    with open('scores.log','a+') as f:
        f.write('{}, '.format(score))
     
accuracies = []

counter = 0
accuracy = 0.0

try:
  while accuracy < 0.90:
    if slope(accuracies[-10:]) < 0:
        logging.warn('Terminating loop, accuracy degrading over last ten epochs')
        break
  #while counter < 1:
    logging.info('Initiating Test')
    accuracy = test()
    logging.info('accuracy:{0:.2%}'.format(accuracy))
    dump_score(accuracy)
    #print('accuracy:{0:.2%}'.format(accuracy))
    accuracies.append(accuracy)
    #print('Training')
    train()
    counter += 1
    logging.info('\nEpoch: {} Complete'.format(counter))
    #print('\nEpoch: {} Complete'.format(counter))
except KeyboardInterrupt:
  logging.warn('KeyboardInterrupt Detected.  Exiting exectuion path')
#print(accuracies)
  logging.info(str(accuracies))
  sys.exit(-1)
with open ('mnist_weights.json','w') as jfile:
    jfile.write(nn.toJSON())
print('Training complete, dumping parameters as json')

