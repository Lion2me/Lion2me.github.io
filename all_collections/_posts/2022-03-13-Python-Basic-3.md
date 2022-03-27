---
layout: post
title: Python Basic 3 - Function
date: 2022-03-13 21:05:23 +0900
category: Python
use_math: true
---

Python Basic 3 - Function
---

## 함수

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 4개 이상의 리턴 값은 언패킹하지마라

너무 많은 값을 리턴 할 경우 사용되어지는 함수에서 값을 사용 할 때 모호한 문제가 발생 할 수 있습니다.

간단한 예시로는 다음과 같이 볼 수 있습니다.

```python
def tmp(text):
    name, _id, age, grade = text.split(',')
    return (name, _id, age, grade)
text = "lion2me,10,27,A"
name, _id, age, grade = tmp(text)
print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")

# lion2me의 학번은 10, 나이는 27, 등급은 A입니다.
```

위의 예시에서는 학생의 이름과 학번, 나이, 등급을 리턴하는 함수가 있습니다. 짧게 예시를 보여주기 위해 터무니없는 코드를 짰습니다만, 파싱하는 코드라고 생각해주시고 보시길 바랍니다.

이 예시에서 문제는 **함수가 무엇을 어느 위치에 리턴하는지** 입니다. 만약 개발자 입장에서 실수로 순서를 헷갈렸다고 가정해보면 다음과 같은 문제가 발생 할 수 있습니다.

```python
def tmp(text):
    name, _id, age, grade = text.split(',')
    return (name, _id, age, grade)

text = "lion2me,10,27,A"

grade, age, _id, name = tmp(text)
print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")

# A의 학번은 27, 나이는 10, 등급은 lion2me입니다.
```

### 리턴 값으로 None 사용을 자제하고 예외 처리

함수를 작성 할 때 리턴 값을 None으로 사용하는 경우가 있습니다. 사실 False를 표현하는게 아니라면 거의 사용하지 않지만, 추후에 컨트롤 할 수 있도록 None를 리턴하고 다음과 같이 후처리 하는 경우가 있습니다.

```python
if func() == None:
	( 후처리 )
```

하지만 실제 개발하는 서비스에서는 Exception 처리를 권장합니다.

이런 권장사항은 **None이 동작에 관여 할 수 있다**는 점에서 문제점을 제기합니다. 기본적으로 None은 0으로 사용되고 있습니다. 예로 살펴보면

```python
def get_token(text):
    if type(text) != str:
        return None
    return [f"_{ch}_" for ch in text]
    
get_token("as")

# ['_a_', '_s_']
``` 
위의 함수는 알파벳을 하나하나 분리해서 양 옆에 언더바(_)를 통해 토큰화 하는 함수입니다. 이 함수의 매개변수로 text값이 입력되는데 이 값이 str 형태가 아니면 None을 리턴하도록 구현했습니다.

이 경우 어떤 문제가 발생할까요?

리스트에서 요소들의 갯수를 리턴해주는 Counter 함수를 사용해보겠습니다.

```
from collections import Counter

counts = Counter(get_token(b"banana"))
for key, value in counts.items():
    print(key, value)
    # 이하 동작하는 기능들
    
# 
```

위의 동작을 살펴보면 일반적으로 text가 입력되면 key와 value를 통해서 이후 동작이 수행되어야 합니다. 하지만 바이너리 문자와 같은 str 형태가 아닌 값이 들어 올 경우 이후 로직에서 문제가 발생 할 수 있습니다. 이 경우 이러한 문제를 방지하기 위해 Exception를 발생시켜야 하는데, 위의 함수는 None값으로 이어서 실행됩니다.

실제 서비스에서 이런 코드를 작성하게 되면 어디서 에러가 발생 했는지 알기 어렵게 됩니다. 그러므로 Exception을 추천하고 있습니다.

### 변수 영역과 클로저의 상호작용 - 파이썬의 함수는 일급 시민 객체임

먼저 **일급 시민 객체**라는 단어에 먼저 주목해보겠습니다. 

일급 시민 객체란 다음과 같은 조건을 만족하는 객체를 말합니다.

- 변수 혹은 데이터 구조안에 할당 할 수 있어야 한다.
- 객체에 인자로 넘길 수 있어야 한다.
- 객체의 리턴값으로 리턴 할 수 있어야 한다.

파이썬에서의 객체는 일급 시민 객체입니다. 우리가 함수 자체를 변수에 할당하고, 데코레이터 혹은 클로저를 사용 할 수 있는 이유도 이러한 특징 덕분입니다.

그러면 클로저에 대한 설명으로 넘어가겠습니다.

클로저는 **어떤 함수의 내부 함수** 이면서 **외부 함수의 변수를 사용**하면서 **외부함수가 내부 함수를 리턴**하는 함수입니다. 말장난 같지만 사실입니다.

**간단하게 클로저는 함수에 리턴되어지는 내부 함수라고 생각 할 수 있습니다.** 이게 무엇을 말하는지 알아 볼 수 있는 코드를 작성해보겠습니다.

```python
def get_grade(score):
    def pass_or_fail():
        if score > 80:
            return "PASS"
        else:
            return "FAIL"
    return pass_or_fail

a = get_grade(90)
a()

# PASS
```

1. pass\_or\_fail 함수는 get\_grade 함수 안에 있습니다.
2. pass\_or\_fail 함수는 외부 함수의 변수인 score를 사용하고 있습니다.
3.  get\_grade 함수는 pass\_or\_fail 함수를 리턴하고 있습니다.

그러므로 **클로저**입니다.

클로저 사용하는 코드를 보면 왜 사용하는지 궁금증이 생깁니다. 코드는 더욱 어려워보이고 길어집니다만, 이 방법은 나름대로 장점이 있습니다.

먼저 외부 함수가 메모리에서 해제되고도 내부 함수의 로직은 제대로 동작합니다. 물론 이 부분도 중요하지만, 전역변수가 아닌 함수 내 변수를 제한적으로 사용해서 코드의 모호함을 줄여주는게 중요한 장점이라고 생각합니다.

### 가변 인자를 이용 할 때 주의 할 점

가변 인자를 이용해서 함수에 매개변수로 할당 할 수 있는 점에 대해서는 이해하고 있는 부분이기 때문에 넘어가겠습니다.

하지만 사용 시 주의 할 점이 있어서 한 줄 적어보려 합니다.

**제너레이터 사용 시에는 가변 인자를 사용하면 모든 iterator의 반환값을 가져와서 동작하기 때문에 주의**해야 합니다.

보통 제너레이터를 사용하는 이유는 데이터의 양이 많거나 메모리 사용을 최소화하기 위해서 사용합니다. 하지만 가변 인자를 사용해버리면 모든 값을 가져 온 후 넘기려하기 때문에 메모리 문제가 발생 할 수 있습니다.

### 키워드 인자 사용

가변 인자를 이용해서 함수에 매개변수로 할당 할 때 데이터의 순서가 큰 문제가 될 수 있습니다. **함수의 리턴 값이 4개 이상 일 때**의 문제와 동일 한 문제도 일어 날 수 있습니다.

하지만 다음과 같이 키워드 인자를 사용하면 문제가 해결 될 수 있습니다.

```
def tmp(text):
    name, _id, age, grade = text.split(',')
    return {"name":name, "_id":_id, "age":age, "grade":grade}

def print_grade(age,_id,name,grade):
    print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")
    
text = "lion2me,10,27,A"
text = tmp(text)

print_grade(**text)

# lion2me의 학번은 10, 나이는 27, 등급은 A입니다.
```
다음과 같이 입력 된 순서와 상관없이 key에 맞는 인자값으로 자동으로 입력해주기 때문에 서비스 상 문제가 발생 할 확률이 현저히 적어집니다.

### 함수 초기값 설정 시 주의 할 부분

이 부분은 처음 알게 된 사실이라 충격받아서 적게 되었습니다.

```python
def func(value, default = {}):
    default[value] = value
    return default

a = func("안녕")
b = func("하세요")

print(b)

# {'안녕': '안녕', '하세요': '하세요'}
```
이제 우리는 이 어이없는 상황에 대해서 해석을 할 예정입니다.

가장 먼저 중요한 점은 **함수 인자의 디폴트 값은 함수가 정의 될 때 단 한 번 실행**한다는 점입니다. 이 점을 알고 있으면 위의 상황이 크게 이상해보이지 않습니다. 하지만 서비스가 default 값에 의존하는 상황이라면, 아찔하죠.

그래서 **None을 디폴트 값으로 사용 하는 것을 권장**하고 있습니다. 그 후 생기는 문제에 대해서는 후처리를 통해서 문제를 해결하는 것을 권장합니다.

하지만 모든 상황에서 이러한 방식을 사용하기보다 함수가 특정 매개변수의 변화에 의존이 강한 상황이라면 생각할만한 방법이라고 생각합니다.

### 파라미터 입력 시 키워드 명시 유무 및 위치 지정 인자인지 구분 가능

이 부분은 API를 개발 할 때 안정성을 주는 방법으로 매우 유용 할 것이라 생각되어 적게 되었습니다.

일반적으로 함수의 인자는 순서에 맞게 입력되게 됩니다.

```python
def print_grade(age,_id,name,grade):
    print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")
    
print_grade(27,10,'lion2me','A')

# lion2me의 학번은 10, 나이는 27, 등급은 A입니다.
```
예를 들면 위와 같습니다.

하지만 어느 위치가 어떤 인자인지 알기 쉽지 않습니다. 이유는 실제 코드에서는 함수의 선언과 실제 사용되는 위치까지 너무 먼 거리가 떨어져 있기 때문입니다. 혹은 모듈화가 되어 있을 수 있구요.

그러면 다음과 같은 방법을 사용 할 수 있습니다.

```python
def print_grade(age,_id,name,grade):
    print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")
    
print_grade(age = 27, _id = 10 , name = 'lion2me' , grade = 'A')

# lion2me의 학번은 10, 나이는 27, 등급은 A입니다.
```
이런 식으로 어느 인자에 값을 입력하는지 명시하면 쉽게 이해 할 수 있습니다. 그럼 어떤 것을 암묵적으로 입력하고 어떤 것을 명시적으로 입력해야 할까요?

그 점을 함수를 만들 떄 정의 할 수 있습니다!

바로 함수 매개변수 선언 중간에 **\* 을 입력하면 뒤의 매개변수의 경우에는 명시적으로 정의**하라는 의미를 갖습니다.

```python
def print_grade(age,_id,*,name,grade):
    print(f"{name}의 학번은 {_id}, 나이는 {age}, 등급은 {grade}입니다.")
    
print_grade(age = 27, _id = 10 , name = 'lion2me' , grade = 'A')

# lion2me의 학번은 10, 나이는 27, 등급은 A입니다.
```

### functools.wrap을 사용한 데코레이터 작성

개발하면서 크게 문제를 겪은 부분은 아니지만 습관을 들이기 위해 기록합니다.

데코레이터를 작성 할 때 주로 다음과 같이 작성하곤합니다.

```python
def deco(func):
    @wrap(func)
    def action(*args):
    return action

@deco
def func:
    ... 이하 생략
```

하지만 이 경우 func함수의 메타데이터는 자동적으로 deco 데코레이터의 메타데이터로 덮어씌어지기 때문에 pickle로의 변환이나, 실행 과정에서 추적하기 어려울 수 있습니다.

그래서 functools의 wraps를 이용하는 것을 권장합니다.

```python
from functools import wraps

def deco(func):
    @wraps(func)
    def action(*args):
    return action

@deco
def func:
    이하생략
```
위와같이 코드를 작성하면 wraps 어노테이션을 가지고 있는 wrapper는 action의 메타데이터를 복사해준다고 합니다.