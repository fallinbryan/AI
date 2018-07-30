from NeuralNetwork import NeuralNetwork as NN
import json
import threading
import random
import MNIST
import numpy as np

normalize = np.vectorize(lambda x: np.float(x/255.0))

nn = NN(28*28,[32,16],10)
nn.learingRate = .1
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
        print('{0:.2%} complete'.format(counter/total),end='\r')
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
        print('{0:.2%} completed     '.format(counter/total),end='\r')
    score = num_correct / total
    print('{} out of {} correct'.format(num_correct,total))
    return score

accuracies = []

counter = 0
while accuracy < .89:
#while counter < 1:
    print('Testing')
    accuracy = test()
    print('accuracy:{0:.2%}'.format(accuracy))
    accuracies.append(accuracy)
    print('Training')
    train()
    counter += 1
    print('\nEpoch: {} Complete'.format(counter))

print(accuracies)

with open ('mnist_weights.json','w') as jfile:
    jfile.write(nn.toJSON())


