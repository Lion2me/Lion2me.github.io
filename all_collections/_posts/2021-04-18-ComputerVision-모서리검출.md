---

layout: post

title: Computer Vision CornerDetection

date: 2021-04-18 21:05:23 +0900

category: Vision

---

교과과정 중 컴퓨터비전 강의를 듣고 배운 내용에 대한 정리입니다.

### 모서리 검출

이번 강의를 기회로 모서리 검출 알고리즘에 대해 공부를 하게 되었습니다.

#### 모서리 검출이란?

여기서 모서리는 특정한 개체의 겉부분이라고 생각할 수 있습니다. 그 중에서도 가장 특징적인, 끝 부분이라고 말 할 수 있습니다.

우리가 이미지를 보다가 모서리라고 생각되는 지점을 떠올려보면 대부분의 모서리 검출 알고리즘을 이해할 수 있습니다.

예를 들어 다음과 같은 유리창으로 이루어진 건물에 대한 모서리를 찾으면 각 유리의 꼭지점 부분이 모서리라고 생각하기 쉬울 것입니다.

저는 많은 모서리 검출 방법에서 포인트 기반 검출 방법에 대해 공부했습니다.

좋은 특징점 검출에는 다음과 같은 변화에 강인해야합니다.

-	카메라의 위치 및 관찰 방향의 변화
-	조명 변화
-	물체의 위치 변화
-	물체의 크기 변화
-	물체의 형태 변화
-	물체의 회전 변화

#### Harris Corner

해리스 코너 알고리즘은 영상의 한 점에서 특정 윈도우를 이동시켰을 때 많은 방향에서 큰 변화를 가지는 점을 특징점(모서리)라고 보는 방법입니다.

<img src="/public/img/harris_corner.png" width="300" height="200">

다음의 윈도우 위치를 보았을 때 꼭지점에 윈도우가 위치한 그림은 다른 그림보다 많은 방향으로 변화량이 큰 것을 알 수 있습니다. 그러면 꼭지점 부근의 윈도우에 특징점이 있을 가능성이 높다는 의미일 것 입니다.

그러면 바로 실습을 해보겠습니다. 위에서 유리로 된 건물 사진과 체스판 사진으로 실습해보았습니다.

<img src="/public/img/chess.jpeg" width="300" height="200">

<img src="/public/img/glassstructure.jpeg" width="300" height="200">

다음의 소스를 실행해보았습니다.

```python
import numpy as np
import cv2 as cv

filename = './이미지/glassstructure.jpeg'
img = cv.imread(filename)
gray = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
gray = np.float32(gray)
dst = cv.cornerHarris(gray,2,3,0.04)

#result is dilated for marking the corners, not important
dst = cv.dilate(dst,None)
# Threshold for an optimal value, it may vary depending on the image.
img[dst>0.01*dst.max()]=[0,0,255]
cv.imshow('dst',img)
if cv.waitKey(0) & 0xff == 27:
    cv.destroyAllWindows()

cv.imwrite('glassstructure_harris.png',img)
```

해리스 코너를 적용한 그림은 다음과 같습니다.

<img src="/public/img/chess_harris.png" width="300" height="200"><img src="/public/img/glassstructure_harris.png" width="300" height="200">

다음과 같이 모서리로 예상되는 부분을 잘 검출한 것을 볼 수 있습니다.

하지만 우리가 알고있는 좋은 특징점에 필요한 요소를 충족시키기에는 이 방법은 부족한 점이 많습니다. 고질적인 문제인 관찰방향에 대해서는 데이터의 부족일 수 있지만, 크기 변화와 같은 요소들도 충족되지 않았습니다.

#### SIFT

이 방법은 좋은 특징점의 요소 중에서 **크기변화 / 조명변화 / 회전변화** 에 강인하며 추가적으로 **잡음** 에도 강인한 모습을 보여줍니다.

방법은 간단히 말하면 분석하는 이미지의 크기와 해상도를 줄여가면서 여러 번 연산을 하는 방식이며 중간 연산은 가우시안 필터를 거친 값을 빼는 방법으로 모서리를 조금씩 강조해나가는 방식입니다.

실제로 사용해보겠습니다.
