---
layout: post
title: Python Basic 4 - Comprehension
date: 2022-03-19 21:05:23 +0900
category: Python
use_math: true
tags:
- Python
- 파이썬
- 컴프리핸션
- 반복문
---

Python Basic 4 - Comprehension
---

## 컴프리핸션

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### Map이나 Filter보다도 컴프리핸션을 사용해라

생각하지 못한 부분이지만, 여기서 중점으로 생각하는 부분은 **읽기 좋은 코드**라는 기준으로 map이나 filter를 사용하게 되면 불필요한 lambda 식이 많아지기 때문에 컴프리핸션의 사용을 권장하고 있습니다.

실제로 이 부분을 읽고 현업에서 map이나 filter를 사용 할 부분을 컴프리핸션을 사용해보았는데, 확실히 가독성이 좋은 느낌이 들었습니다.

### 컴프리핸션 내부의 제어 식을 3개 이상 사용하지 말라

위의 부분과 일맥상통하는 부분입니다.

가독성을 위해 컴프리핸션을 사용했음에도 제어 식이 많이 포홤되어 버리면 또 다시 가독성이 안좋아지기 때문입니다.

이 경우에는 별도의 컴프리핸션 식으로 나누어서 작업하는 것을 권장합니다.

### 대입식을 사용해서 컴프리핸션 안에서 반복 작업을 피하자

이 부분은 확실히 현업에서 사용해볼만한 부분이라고 생각이 됩니다.

나중에 이 글을 확인 할 스스로에게 글을 남기자면 이 부분은 **컴프리핸션 안에서 조건 등을 통해서 식이 어느정도 복잡 할 때 사용 할 만한 기술인듯합니다.**

좋은 예시가 책에 적혀있기 때문에 책의 예시를 가져오겠습니다.

```python
found = {name : get_batches(stock.get(name,0),8)
              for name in order
              if get_batches(stock.get(name,0),8)}
```
위의 코드를 다음과 같은 코드로 바꿀 수 있습니다.

```python
found = {name : batches for name in order
              if (batches := get_batches(stock.get(name,0), 8)}
```
이렇듯 왈러스 연산자를 이용하여 해결 할 수 있습니다.

미래의 나에게 설명을 간단히 하자면 **조건 식에서 stock값을 가져오면서 그 값을 batches에 넣게 되고, 동일한 위치에서 그 값이 사용되기 때문에** 왈러스 연산자를 사용한 것 입니다.

하지만 컴프리핸션을 사용 할 때 주로 다음과 같이 사용합니다.

```python
result = { name : (tenth := count // 10)
             for name, count in stock.items() if tenth > 0 }

# 'tenth' is not defined
```
위 처럼 코드를 작성하면 에러가 발생합니다.
제가 예상하는 이유로는 왈러스 연산자는 오른쪽의 값을 왼쪽의 변수에 저장하고 난 뒤 이 후에 왼쪽의 변수 값으로 비교를 하기 때문입니다.

즉 변수라기보다 비교를 위한 연산자이지만, 덤으로 대입도 하는 것입니다.

```python
result = { name : tenth for name, count in stock.items()
              if (tenth := count // 10 > 0)
```
이렇게 코드를 작성하면 tenth의 값은 성공적으로 대입이 되면서 조건도 잘 돌아가게 됩니다.

### 반환하는 값은 리스트보다 제너레이터를 사용하자

이 부분은 앞으로 파이썬 코드를 작성하면서 중요한 부분이라고 생각합니다.

코드를 작성하면서 많은 부분을 리스트를 이용해서 문제를 해결하지만 반환하는 함수를 작성할때는 가능한 제너레이터를 사용하는 것이 좋습니다.

이유는 다음과 같습니다.

1. 대부분의 리스트 반환 함수를 사용할 때 반복의 주체가 됩니다.
2. 필요 시 제너레이터를 리스트로 쉽게 만들 수 있습니다.
3. 제너레이터는 메모리를 최소한으로 사용합니다.

다음의 함수가 있다고 생각해보겠습니다.

```python
def get_images(uri_list):
    return [ get_media_file( source_uri = uri ) for uri in uri_list ]
```

미디어 파일 하나의 용량이 약 10mb일 때 약 1000개의 미디어가 있다면 메모리 위에 10000mb 약 10gb의 용량이 적재되게 됩니다. 높은 메모리를 가지고 있을 수 있지만, 다양한 프로세스가 실행중이기 때문에 넘칠 것임을 쉽게 예상 할 수 있습니다.

그러면 다음과 같은 코드는 어떨까요?

```python
def get_images(uri_list):
    for uri in uris:
        yield get_media_file( source_uri = uri )
```

이런 방식으로 동작하는 제너레이터를 작성하면 메모리 약 10mb의 사용으로 10gb의 모든 미디어 파일을 사용 할 수 있습니다. 사실 제너레이터를 사용하는 가장 큰 이유가 메모리 이슈이기 때문에 이러한 예시를 들었습니다만, 리스트를 사용하는 방법과 유사하게 사용 가능하기 때문이기도 합니다.

예를 들면

```python
def gener( list_ ):
    for i in list_:
        yield i
        
generator_ = gener( [1,2,3,4,5,6,7,8,9] )
print( [ a for a in generator_ if a % 2 == 0 ] )
```

이렇듯 리스트를 이용한 컴프리핸션도 잘 동작합니다.

대부분 리스트를 사용하는 이유는 순차접근을 이용한 반복이 많습니다. 그 경우에는 제너레이터를 이용하는 것이 효율적인 코드라고 할 수 있을 것 같습니다.

### 제너레이터 사용 시 방어적으로 코딩해라

제너레이터에는 큰 특징이 있습니다.

```python
def test(tmp):
    for i in tmp:
        yield(i)
        
tmp = test([1,2,3,4,5])

print(*tmp)
print(*tmp)
print(*tmp)

# 1 2 3 4 5
#
#
```
위의 결과를 살펴보면 처음 tmp의 값을 보여준 뒤 이후에는 아무런 값도 읽어오지 못합니다.

이러한 결과의 원인은 제너레이터가 반환하는 값은 완성된 리스트가 아닌 순차적으로 값에 접근하기 위한 Iterator이기 때문입니다.

객체에 포함 된 **\_\_iter\_\_** 함수를 통해서 각 원소를 순차 접근하기 위한 객체인 Iterator를 가져오고, 다음 값의 위치를 반환하는 **\_\_next\_\_** 함수를 사용해서 다음 값을 가져오게 됩니다.

만약 코드를 작성 할 때 이러한 부분에 대해 대비하지 않는다면 **빈 리스트로 반환되는 Iterator의 문제점을 찾기 어려울 것 입니다.**

파이썬 코딩의 기술에서는 기가막힌 방법은 하나 알려줍니다.

```python
class test:
    def __init__(self, tmp):
        self.tmp = tmp
    def __iter__(self):
        for i in self.tmp:
            yield i
            
def sum_func(tmp):
    print(sum(tmp))
    
tmp = test([1,2,3,4,5])
sum_func(tmp)
sum_func(tmp)
sum_func(tmp)
```
바로 **\_\_iter\_\_**함수를 구현해줌으로써 별도의 Iterator 객체를 만드는 방법입니다.

설명과 테스트의 용이함을 위해 위와 같은 간략한 코드를 작성했지만, **\_\_init\_\_** 부분에 데이터를 가져오기 위한 Path정보를 입력하거나 DB쿼리 등을 입력 받은 뒤 **\_\_iter\_\_**의 yield 부분에서 잘 순환되게 해준다면 극적인 메모리 절약을 얻어 낼 수 있을 것이라 생각합니다.

### 큰 리스트 컴프리핸션을 사용하는 것 대신 제너레이터 식을 사용해라

말도안되는 기능을 발견하고 심장이 두근두근할만한 부분이였습니다.

일단 우리가 공부했던 리스트 컴프리핸션을 사용해보겠습니다.

```python
get_media() - download file path and into variable

files = [ get_media(file_path) for file_path in file_paths ]
```
이 코드의 치명적인 문제는 리스트에 모든 파일리스트의 요소들이 바이너리 형태로 저장된다는 점입니다. 만약 파일의 크기가 30mb라면 100개 이상의 파일이 동시에 메모리에 올라오게 되고, 우리 친구 컴퓨터가 많이 힘들어 할 것입니다.

우리는 제너레이터를 배웠기 때문에 해결방법을 알고 있습니다. 제너레이터로 각 파일을 순차적으로 내보내주면 되죠.

그럼 함수를 작성해야 할까요? 그렇지 않습니다.

```python
get_media() - download file path and into variable

files = ( get_media(file_path) for file_path in file_paths )
```
괄호만 소괄호로 바꾸어주면 이 값은 자동적으로 제너레이터로 변하게 되는 마법이 일어납니다!

내일 출근날인데 출근해서 바로 바꿀 코드들이 눈앞에 가득한 느낌이네요.

### 제너레이터를 합성 할 때 yield from을 사용해라

사용 할 생각을 못해 본 테크닉이지만 이 부분은 코드만 적어놓고 기억한 후 나중에 사용 할 때 보도록 하겠습니다.

```python
def move(period, speed):
    for _ in range(period):
        yield speed

def pause(delay):
    for _ in range(delay):
        yield 0

def animate():
    for delta in move(4, 5.0):
        yield delta
    for delta in pause(3):
        yield delta
    for delta in move(2, 3.0):
        yield delta

def animate_composed():
    yield from move(4, 5.0)
    yield from pause(3)
    yield from move(2, 3.0)
        
def render(delta):
    print(f"Delta: {delta:.1f}")

def run(func):
    for delta in func():
        render(delta)
        
run(animate)
print("------------")
run(animate_composed)

# Delta: 5.0
# Delta: 5.0
# Delta: 5.0
# Delta: 5.0
# Delta: 0.0
# Delta: 0.0
# Delta: 0.0
# Delta: 3.0
# Delta: 3.0
------------
# Delta: 5.0
# Delta: 5.0
# Delta: 5.0
# Delta: 5.0
# Delta: 0.0
# Delta: 0.0
# Delta: 0.0
# Delta: 3.0
# Delta: 3.0
```
간단하게 생각하면 Iterator의 모든 요소를 가져오는 과정에서 반복문을 사용하게 되는데, 그 부분을 요약 할 수 있는 방법으로 보여집니다. 직관적이지만 각 요소에 대해서 개별적으로 작업을 하게 된다면 사용 할 수 없을 것 같습니다.

### 제너레이터에 send로 데이터 주입하지마라

제너레이터의 send 함수는 이터레이터에 데이터를 주입 할 수 있는 함수입니다. 하지만 책에서는 이 함수를 권장하지 않습니다. 간단히 테스트 한 코드를 보겠습니다.

```python
def my_generator():
    received = yield 
    print(f"받은 값 = {received}")
    
it = iter(my_generator())
output = it.send(None)
print(output)

try:
    it.send("안녕!")
except StopIteration:
    pass
    
# None
# 받은 값 = 안녕!
```

결과 값을 보면 None이 보입니다. 그러면 만약 첫 output에 None이 아닌 다른 값을 보내면 어떻게 될까요?

```python
def my_generator():
    received = yield 
    print(f"받은 값 = {received}")
    
it = iter(my_generator())
output = it.send("안녕~")
print(output)

try:
    it.send("안녕!")
except StopIteration:
    pass

# TypeError: can't send non-None value to a just-started generator
```

보시다시피 제너레이터의 첫 값은 무조건 None 타입이 입력되게 됩니다. 문제는 실제 서비스에서 첫 값은 None이 아니겠죠.

이 문제를 해결 할 수 있는 방법은 다양하지만, 굳이 그렇게까지 해서 send를 사용 할 필요는 없습니다. 심지어 구조가 복잡해질수록 send에 의존하는 코드를 보면 의미를 알아보기 어려울수도 있습니다.

책에서는 **Iterator를 인자로 받는 함수를 만드는 것**을 제안합니다.

개인적으로도 이 방법은 효과적이라는 생각이 듭니다. 이터레이터를 인자로 받아 각 값을 읽은 변수를 별도로 변환하여 사용 할 때, 사용 할 인자를 추가적으로 받아 사용하게 된다면 유연하고 보기좋은 코드가 될 것이라 생각합니다.

책에 있는 예제를 하나 가져오면 다음과 같습니다.

```python
def wave_cascading( amplitude_iter, steps ):
    # 생략
    for step in range(steps):
        amplitude = next(amplitude_iter)
        result = action(amplitude) # 어떠한 동작
        yield result
```
위와 같은 코드를 작성하면 각 요소에 대해서 각각의 steps라는 인자를 통해 다른 동작을 수행하는 제너레이터를 작성 할 수 있습니다.

### 제너레이터 안에서 throw로 상태를 변환하지마라

이해가 조금 어려운 부분이였지만, 쉽게 말하면 이렇게 말할 수 있을 것 같다.

**제너레이터에서 throw를 이용해서 예외처리를 하면 코드가 복잡해 질 가능성이 높다. 그러므로 가능하면 \_\_iter\_\_ 함수를 구현해서 클래스 내에서 예외한 경우가 발생 할 때 전이시키는 방법으로 해결해라**

이건 코드와 함께 보겠습니다.

먼저 Exception을 제너레이터 안에서 발생시킨 경우는 다음과 같은 코드를 작성합니다.

```python
def timer(period):
    current = period
    while current:
        current -= 1
        try:
            yield current
        except Exception:
            current = period
            
def run():
    it = timer(4)
    while True:
        try:
            if check_for_reset():
                current = it.throw(Exception())
            else:
                current = next(it)
        except StopIteration:
            break
        else:
            print(current)
```

반면에 클래스로 작성 한 뒤 별도의 함수를 통해 처리하는 방법은 다음과 같습니다.

```python
class Timer:
    def __iter__(self, period):
        self.current = period
        self.period = period
        
    def reset(self):
        self.current = self.period
    
    def __iter__(self):
        while self.current:
            self.current -= 1
            yield self.current
            
def run():
    timer = Timer(4)
    for current in timer:
        if check_for_reset():
            timer.reset()
        print(current)
```    

일단 확실한건 코드 자체가 깔끔한 느낌이 들고, 클래스 내 함수의 명명규칙이 명확하다면 코드를 리뷰 할 때 run 함수만 확인해도 전체적인 동작과 Timer 클래스의 이해가 쉬울 것 같습니다.

