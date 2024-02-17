---
layout: post
title: Python Basic 2 - List & Dict
date: 2022-03-11 21:05:23 +0900
category: Python
use_math: true
tags:
- Python
- 파이썬
- 리스트
- 딕셔너리
- 자료구조
- 데이터구조
---

Python Basic 2 - 리스트와 딕셔너리
---

## 리스트와 딕셔너리

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 1. 나머지를 잡아내는 언패킹

리스트를 사용하면서 선 순위의 값을 사용하고 나머지를 사용 할 때가 있습니다. 주로 이런 상황에서는 슬라이싱을 이용해서 문제를 해결하는데, 새로운 해결 방법을 알게되어 정리합니다.

기존의 방법을 살펴보면 다음과 같습니다.
```Python
a = [12,5,7,3,1]
a.sort(reverse=True)

highest = a[0]
second = a[1]
others = a[2:]

print(highest, second, others)

# 12 7 [5, 3, 1]
```
일일이 각 인덱스에 접근하고 이후 인덱스를 슬라이싱해서 가져왔습니다. 이렇게 보면 명확하기는 하지만 코드가 길어지기도합니다.

```python
a = [12,5,7,3,1]
a.sort(reverse=True)

highest, second, *others = a

print(highest, second, others)

# 12 7 [5, 3, 1]
```
언패킹을 하게 되면 위의 코드로 정리가 가능합니다. 또한 중간의 값들을 리스트로 담을수도 있습니다.

```Python
a = [12,5,7,3,1]
a.sort(reverse=True)

highest, *others, lowest = a

print(highest, others, lowest)

# 12 [7, 5, 3] 1
```

---

### 2. key를 이용 한 정렬

정렬은 코드를 작성하면서 자주 사용하는 로직입니다.

일반적으로 문자열이나 정수 등의 기준이 명확한 리스트에 대해서는 쉽게 정렬이 가능하지만, 객체와 같은 복잡한 조건이 필요한 변수가 있습니다.

이런 경우에는 sort 함수의 key 매개변수에 정렬에 사용 할 값을 적어주면 됩니다. 예를 들면 다음과 같이 사용 할 수 있습니다.

```python
class person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __repr__(self):
        return f"name = {self.name} age = {self.age}"
```
```Python
people = [person(name = "lion2me", age = 27), person(name = "anonymous", age = 30), person(name = "goos", age = 25)]
people.sort(key=lambda x:x.name)
for pe in people:
    print(pe)

# name = anonymous age = 30
# name = goos age = 25
# name = lion2me age = 27
```
이러한 List of Object의 경우에는 key를 이용해서 정렬을 할 수 있습니다. 그럼 정렬의 기준이 여러 조건이라면 어떨까요?

여기서 중요한 것은 **튜플**입니다. 튜플에는 다른 값과 비교 할 수 있는 정의가 포함되어있습니다. 예를들면 \_\_lt\_\_(less than)의 경우에는 해당 값이 다른 값보다 더 적은지를 알려줍니다. 이 외에도 eq(동일한 지), gt(더 큰지)등을 제공하고 있습니다.

**즉, 비교하고자 하는 값을 튜플로 감싸면** 비교가 가능해집니다.

예를 들면 다음과 같이 사용 할 수 있습니다.

```Python
people = [person(name = "lion2me", age = 27), person(name = "goos", age = 30), person(name = "goos", age = 25)]

people.sort(key=lambda x:(x.name, -x.age))
for pe in people:
    print(pe)

# name = goos age = 30
# name = goos age = 25
# name = lion2me age = 27
```

이제 여러 조건을 포함해서 정렬 할 수 있게 되었습니다. 그런데 저기 **-age**가 조금 거슬립니다. 왜냐하면 **정수의 경우에는 -를 이용해서 정렬이 가능한데 문자열은 안되니까요.**

여기서 **reverse**의 개념이 등장합니다. **sort함수의 파라미터로 들어가는 reverse에 True값을 넣어주면 결과는 역순으로 출력**됩니다.

문제는 **전체 결과가 역순**으로 들어가는 점입니다. 우리는 특정한 값을 기준은 역순으로 하고 특정 값은 정방향으로 정렬을 하고 싶습니다.

그럴때는 정답이 없습니다. ~~일단 제가 아는 한에서는...~~ 결국 **중요하지 않은 기준**부터 정렬을 일일이 수행하면 원하는 결과를 얻을 수 있습니다. 왜냐하면 중간중간 정렬의 결과는 다음 정렬의 시작 시점이 되기 때문에 가장 강한 정렬기준이 마지막에 정렬 한 순서이기 때문입니다.

---

### 3. 딕셔너리 사용 시 in 비교 후 KeyError 사용을 자제하고 get 사용

딕셔너리를 사용하다보면 **"이 키가 있나? 아 없으면 이걸로 하자"** 와 같은 로직을 구현 할 때 **in**키워드와 **KeyError**를 사용하기도 합니다.

저는 개인적으로 Defaultdict를 사용하는 편입니다. **Defaultdict을 사용해서 특정 값의 키 확인을 하게 되면 True Or False가 리턴**되기 때문에 조건식에 간단히 사용 할 수 있습니다.

하지만 일반적인 딕셔너리를 in 키워드로 비교하게 되면 KeyError가 발생하게 되서 Exception 처리해줘야하는 불편함이 있습니다.

이러한 이유때문에 get함수를 권장합니다. **딕셔너리에서 get 함수로 검색했을 때 해당하는 값이 없다면 None을 리턴하게 되고 조건식에서 None은 False로 표현**됩니다.

---

### 4. Defaultdict을 직접 만들자!

세상에 이 방법은 처음 알게 되었는데 제가 궁금했던 부분을 정확하게 집었습니다. Defaultdict을 사용하면서 겪은 가장 큰 어려움이 **객체나 함수의 결과를 저장하지 못한다.** 였습니다.

이유는 **인자를 전달 할 수 없다.** 입니다.

이런 문제를 완벽하게 해결 할 수 있는 방안이 바로 Defaultdict를 직접 만들 수 있는 **\_\_missing\_\_()** 를 직접 정의하는 방법입니다.

이 메서드를 정의해서 Custom Defaultdict를 만들기 위해서는 가장 먼저 구현 한 클래스가 dict를 상속받는 객체여야 합니다.

```python
class CustomDefaultDict(dict):

  def func(key):
    f"key = {key}"

  def __missing__(key):
    self[key] = func(key)
    return key
```
이러한 방식으로 자유롭게 Defaultdict을 사용 할 수 있습니다. 세상에 너무 좋다. 이 방법은 자주 사용하게 될 것 같습니다!

사용 시 명심해야 하는 점은 \_\_missing\_\_(key)는 항상 해당 키 값에 default 값을 적재 한 후 그 값을 리턴해주어야 합니다.
