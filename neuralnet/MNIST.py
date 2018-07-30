#  13 train_images =  MNIST.get_images('mnist/train-images-idx3-ubyte')
# 14 test_images  =  MNIST.get_images('mnist/t10k-images-idx3-ubyte')
# 15 train_labels =  MNIST.get_labels('mnist/train-labels-idx1-ubyte')
# 16 test_labels  =  MNIST.get_labels('mnist/t10k-labels-idx1-ubyte')
# refrence : http://yann.lecun.com/exdb/mnist/
import numpy as np


class InvalidImageData(Exception):
  def __init__(self, *args, **kwargs):
    Exception.__init__(self, *args, **kwargs)

class InvalidLabelData(Exception):
  def __init__(self, *args, **kwargs):
    Exception.__init__(self, *args, **kwargs)


def get_images(fname):
  magic_number = 0x00000803 # double check
  with open(fname, 'rb') as f:
    data = f.read()
  if int.from_bytes(data[0:4], byteorder='big') != magic_number:
    raise InvalidImageData('Invalid Header for image Data')

  offset = 16;
  img_count = int.from_bytes(data[4:8],byteorder='big')
  img_width = int.from_bytes(data[8:12],byteorder='big')
  img_height = int.from_bytes(data[12:16],byteorder='big')
  img_len = img_height * img_width
  
  images = []
  for _ in range(img_count):
    try:
      images.append(np.array(bytearray(data[offset:offset+img_len]),dtype='uint8'))
      offset += img_len
    except Exception as e:
      raise InvalidImageData('Error Reading Image data:\n{}'.format(e))

  return images

def get_labels(fname):
  magic_number = 0x00000801
  with open(fname, 'rb') as f:
    data = f.read()

  if int.from_bytes(data[0:4],byteorder='big') != magic_number:
    raise InvalidLabelData('Invalid Header for label Data')

  offset = 8;
  labels = []
  label_count = int.from_bytes(data[4:8],byteorder='big')
  for _ in range(label_count):
    labels.append(int.from_bytes(data[offset:offset+1],byteorder='big'))
    offset += 1

  return labels

