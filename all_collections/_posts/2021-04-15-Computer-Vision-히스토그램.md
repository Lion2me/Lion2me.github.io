---
layout: post
title: Computer Vision Histogram
date: 2021-04-15 21:05:23 +0900
category: Vision
---

교과과정 중 컴퓨터비전 강의를 듣고 배운 내용에 대한 정리입니다.

히스토그램
----------

영상처리에서 이미지를 데이터화 시키는 방법으로는 M*N[해상도]로 샘플링합니다. 그리고 모든 명얌을 $L$단계로 양자화 시킵니다.

이렇게 [0,L-1] 범위로 나누어진 명암(혹은 RGB와 같은 값 등)을 차트 형태로 볼 수 있는 방법이 있습니다.

히스토그램은 일반적으로 도수 분포를 막대 차트로 표현한 것으로 생각하면 됩니다.

하지만 컴퓨터 비전에서 히스토그램은 조금 더 나아가 이미지의 분별하기 위한 선명도를 살릴 수 있는 방법을 제안하기도 합니다.

먼저 한 이미지를 기준으로 실제로 히스토그램을 그려보겠습니다.

쉽게 이해하기위해 명암을 기준으로 이미지를 변환 한 다음 진행하겠습니다.

다음의 두 이미지를 이용하여 실습을 진행하겠습니다.

<img src="/public/img/이미지1.jpeg" width="300" height="400">

<img src="/public/img/common2.jpeg" width="300" height="400">

```python

import cv2
import numpy as np
import matplotlib.pyplot as plt

img = cv2.imread('./이미지/이미지1.jpeg' ,cv2.IMREAD_GRAYSCALE)
#img = cv2.imread('./이미지/common2.jpeg' ,cv2.IMREAD_GRAYSCALE)


hist = cv2.calcHist([img],[0],None,[256],[0,256])

plt.hist(img.flatten(),256,[0,256],color='b')
plt.xlim([0,256])
plt.legend(['histogram'],loc='upper right')
plt.show()

```

각각의 이미지에 대한 히스토그램은 다음과 같습니다.

<img src="/public/img/이미지1_hist.png" width="300" height="200">

<img src="/public/img/common2_hist.png" width="300" height="200">

원래는 RGB와 같은 하나의 특징에 대한 값을 전부 그릴 수 있지만, 이미지의 분류에 있어서 밝기에 따라 RGB는 크게 흔들리는 성질이 있기 때문에 명암으로 구분하는 방법을 많이 사용한다고 들었습니다. 이 부분에 대해서는 확실하지 않기 때문에 더 공부를 진행하면서 알아보겠습니다.

이제 우리는 이 히스토그램을 이용하여 흑백이미지의 특징이 될 부분을 선명하게 구분해보도록 하겠습니다.

히스토그램을 보면 알 수 있지만 한쪽으로 데이터가 몰려있음을 알 수 있습니다. 많은 이미지가 어두운 배경 등 다양한 이유로 한 쪽으로 몰려있는 히스토그램을 쉽게 볼 수 있습니다.

그러면 그 몰려있는 히스토그램을 조금씩 벌린다면 어떤 일이 일어날까요? 이 과정을 히스토그램 평활화라고 부릅니다.

몰려있는 특정 생상의 집합은 이미지를 단순하게 표현합니다. 조금 어두운 그림자와 햇빛을 받지 않는 벽면은 확실한 차이를 가져야 하는 부분임에도 비슷한 명암을 가지고 있다는 이유로 구분이 되지 않을 수 있죠.

opencv2에서는 히스토그램 평활화를 사용하기 쉽게 제공하고 있습니다.

```python

import cv2
import numpy as np
import matplotlib.pyplot as plt

img = cv2.imread('./이미지/이미지1.jpeg' ,cv2.IMREAD_GRAYSCALE)
##img = cv2.imread('./이미지/common2.jpeg' ,cv2.IMREAD_GRAYSCALE)

# img의 히스토그램 평활화 함수
img = cv2.equalizeHist(img)
hist = cv2.calcHist([img],[0],None,[256],[0,256])

plt.hist(img.flatten(),256,[0,256],color='b')
plt.xlim([0,256])
plt.legend(['histogram'],loc='upper right')
plt.show()
```

결과로는 다음과 같이 각각의 레벨이 구분 된 히스토그램이 만들어집니다.

<img src="/public/img/이미지1_eqhist.png" width="300" height="200">

<img src="/public/img/common2_eqhist.png" width="300" height="200">

이 히스토그램을 기반으로 이미지를 띄워볼까요?

구분하기 쉽게 두 사진의 before after를 합쳐서 띄워보겠습니다.

<img src="/public/img/이미지1.png" width="600" height="400">

<img src="/public/img/common2.png" width="600" height="400">

이것으로 히스토그램에 대한 내용을 마치겠습니다.
