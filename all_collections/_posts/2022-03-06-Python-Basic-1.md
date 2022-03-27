---
layout: post
title: Python Basic 1 - Think Python
date: 2022-03-06 21:05:23 +0900
category: Python
use_math: true
---

Python Basic 1 - Think Python
---

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

최근 데이터 엔지니어링 관련 업무를 시작하면서 파이썬에 대한 관심이 높아졌기 때문에 ~~야호 이제 Spring은 안해도 된다~~~ 관련 학습을 시작했고, 파이썬 코딩의 기술을 통해 학습을 시작했습니다.

---

## 파이썬답게 생각하기


목차의 첫 주제로써 파이썬으로 코딩 할 때 주의 할 점과 추천하는 바를 알려주고 있습니다.

모든 소주제에 대해 다루기보다 읽으면서 "이 부분은 실제 개발에서 꼭 고려해야 하는 점이다!"라고 생각되어지는 부분을 주로 포스팅 할 예정입니다.

### 1. bytes와 str의 차이

이 부분에서 가장 많은 어려움을 겪을 때는 다른 OS에서 다루던 파일을 사용 할 때라고 생각합니다.
또한, 현재 읽거나 쓰려는 파일이 텍스트 기반의 파일인지 혹은 바이너리 기반의 파일인지에 대해 이해하지 못한 상황에서 문제가 발생 할 수도 있습니다.

#### 1-1. bytes의 선언

먼저 bytes 인스턴스를 보겠습니다.

기본적으로 문자열을 선언 할 때 앞에 'b'를 붙이면 해당 문자는 bytes를 기반으로 만들어짐을 나타내는 것 입니다.
```Python
a = b'h\x65llo'
print(list(a))
print(a)

# [104, 101, 108, 108, 111]
# b'hello'
```

#### 1-2. str의 선언

```Python
a = "h\u0300ello world"
print(list(a))
print(a)

# ['h', '̀', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
# h̀ello world
```

#### 1-3. 그럼 무슨 차이가 있나?

**저는 인코딩(어떻게 읽을 것인지 명확하게 정의)되어 있다면 str이라고 생각하고, 그렇지 않다면 bytes라고 생각합니다.**

여기서 인코딩이란 우리가 흔히 알고 있는 "UTF-8", "EUC-KR" 과 같은 것을 말합니다.

컴퓨터 내의 모든 문자열 데이터는 실제로 byte(정확히는 bit)로 만들어집니다. 위의 1-1의 bytes 선언 예제를 보시면 문자열을 ASCII로 바꿔서 보여주는 것을 볼 수 있습니다. 전형적인 1바이트의 영문 및 기호의 표기 방식이죠.

<https://wikidocs.net/20403>

위 링크의 문서를 확인하시면 "\\x"라는 표기 방식이 아스키 코드 값을 16진수로 표현하는 표준 출력 방식임을 알 수 있습니다.

마찬가지로 1-2의 str 선언 예제를 보시면 등장하는 "\\u"또한 유니코드의 표기 방식임을 쉽게 알 수 있습니다.

**1. 두 값은 서로를 비교 할 수 없습니다.**

```Python
a = "can i drink coffee"
b = b"can i drink coffee"
c = "b\'can i drink coffee\'"
print("a = ",a)
print("b = ",b)
print("c = ",c)
print("a == b -> ",a == b)
print("b == c -> ",b == c)

# a =  can i drink coffee
# b =  b'can i drink coffee'
# c =  b'can i drink coffee'
# a == b ->  False
# b == c ->  False
```

위의 결과를 보면 알 수 있듯이 **두 값은 서로 동일 할 수 없습니다.** 뿐만 아니라 ==이 아닌 비교 연산자를 사용하면 TypeError가 발생하기 때문에 두 인스턴스는 아예 다르다고 생각 할 수 있습니다.

**2. 두 값이 담긴 파일을 다룰 때 형태가 명확해야 합니다.**

이 문제는 쉽게 예를 들면 다음과 같은 예시가 있습니다.

```Python
with open('./data.bin', 'w') as f:
    f.write(b'\xf1\xf2\xf3\xf4\xf5\xf6\xf7')

# TypeError: write() argument must be str, not bytes
```

open 함수를 이용해서 파일을 "w"(str) 로 열고 binary 정보를 저장하려고 하면 TypeError가 발생합니다.

반대의 경우도 마찬가지입니다.

```Python
with open('./data.bin', 'wb') as f:
    f.write('\xf1\xf2\xf3\xf4\xf5\xf6\xf7')

# TypeError: a bytes-like object is required, not 'str'
```

**3. 인코딩 혹은 디코딩 과정을 거치면 서로의 타입이 될 수 있습니다.**

위의 예제를 통해서 각자의 타입을 읽을 때 읽을 형태가 정의되어야 한다는 것을 알 수 있었습니다. 문자열의 경우에는 "r" 또는 "w", "a"로 정의되고 bytes의 경우에는 "rb", "wb"로 되어야 합니다.

그러면 bytes 파일을 str로 읽을 수 없나? 읽을 수 있습니다.

보통 인코딩이라는 단어를 다양한 의미로 사용하고 있지만, 문자열에서의 인코딩은 **해당 문자열을 어떻게 표현 할 것인지**에 대한 약속이라고 말할 수 있습니다.

data.bin 파일을 바이너리 형식으로 만들어서 문자열로 읽어보겠습니다.

```Python
with open("./data.bin", "r", encoding='utf-8') as f:
    print(f.read())

# UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf1 in position 0: invalid continuation byte
```
일반적으로 mac에서 사용하는 utf-8로 해당 파일을 읽으니 읽어지지 않는 문제가 발생했습니다.

그러면 cp1252(주로 윈도우에서 사용되는 인코딩 방식)으로 읽으면 어떻게 될까요?

```Python
with open("./data.bin", "r", encoding='cp1252') as f:
    print(f.read())

# ñòóôõö÷
```
성공적으로 읽을 수 있음을 알게 되었습니다.

즉 바이너리 파일을 문자열로 변환하는 작업을 문자열 인코딩이라고 말할 수 있습니다. 그 반대가 decode입니다.

```Python
str = "hello world!"

str_enc = str.encode(encoding='utf16')

print ("The encoded string in utf16 format is : ",)
print (str_enc )

print ("The decoded string is : ",)
print (str_enc.decode('utf16', 'strict'))

# The encoded string in utf16 format is :
# b'\xff\xfeh\x00e\x00l\x00l\x00o\x00 \x00w\x00o\x00r\x00l\x00d\x00!\x00'
# The decoded string is :
# hello world!
```

과거에 텍스트 분석을 하면서 이러한 문제들이 발목을 잡았 던 경험이 있었기 때문에 관련 내용을 정리해보았습니다.

### 문자열 format

문자열 formatting은 최근에 자주 혼란을 겪는 부분입니다.

주요하게 말하는 내용은 f-string을 사용을 권장하는 내용이지만, meta data에 URL을 저장하여 가능 한 짧고 명확한 코드로 문자열을 formatting하고 싶을 경우에는 어떻게 해야하는지 잘 모르겠습니다.

```python
key = "이것은 key"

a = f"test = {key}"
print(a)

dict_ = {"a" : "이것도 key"}
a = f"test = {dict_.get('a')}"
print(a)

# test = 이것은 key
# test = 이것도 key
```

아마도 이런 경우에는 결국 format 함수를 사용해야 할 것 같습니다.

```Python
url = "http://localhost:8000/{}/{}"
print("request get ",url.format("path_param1","path_param2"))
print("request get ",url.format("path_param3","path_param4"))
print("request get ",url.format("path_param5","path_param6"))

# request get  http://localhost:8000/path_param1/path_param2
# request get  http://localhost:8000/path_param3/path_param4
# request get  http://localhost:8000/path_param5/path_param6
```

### Unpacking

Unpacking은 튜플 또는 리스트과 같은 데이터를 읽을 때 인덱스를 통해 일일이 접근하지 않고 변수를 가져 올 수 있는 방법입니다.

간단한 예제로 다음과 같이 알아 볼 수 있습니다.

만약 Unpacking이 없었다면 다음과 같은 코드를 작성해야합니다.
```python
a = [(1,1),(2,2),(3,3)]
for i in range(len(a)):
    print(a[i][0], a[i][1])

# 1 1
# 2 2
# 3 3
```

하지만 Unpacking을 사용하면 조금 더 깔끔한 코드로 작성 할 수 있습니다.
```python
a = [(1,1),(2,2),(3,3)]
for t1,t2 in a:
    print(t1, t2)

# 1 1
# 2 2
# 3 3
```

파이썬에서는 이러한 Unpacking을 이용해서 인덱스로 접근하는 방식보다 더욱 깔끔한 코드를 작성 할 수 있도록 해줍니다.

### 여러 Iterator에 대해 나란히 루프를 수행하려면 zip을 사용하자

파이썬에서 제공하는 zip의 매력을 새롭게 알 수 있었습니다.

먼저 zip을 사용하지 않은 코드와 사용 한 코드를 비교해보겠습니다.

```Python

users = ["lion2me","jeny","python"]
items = ["mac book m1","mac book intel","samsung notebook"]
for idx, user in enumerate(users):
    print(f"{user}님이 {items[idx]}를 구매했습니다.")

#lion2me님이 mac book m1를 구매했습니다.
#jeny님이 mac book intel를 구매했습니다.
#python님이 samsung notebook를 구매했습니다.
```

각 user에게 해당 인덱스에 맞는 item을 매칭하는 로직입니다.

정상적으로 동작하는 로직이고 큰 문제가 없어 보이는 코드일 수 있지만, items[idx] 부분이 상당히 눈에 거슬립니다.

만약 중간에 item을 변환하는 작업이 있다면 items 배열에 직접 인덱싱해서 동작을 수행하거나 새로운 변수를 생성해야 합니다.

이러한 문제를 해결 할 수 있는 방법으로 다음의 코드를 볼 수 있습니다.

```python
users = ["lion2me","jeny","python"]
items = ["mac book m1","mac book intel","samsung notebook"]
for user,item in zip(users,items):
    print(f"{user}님이 {item}를 구매했습니다.")

#lion2me님이 mac book m1를 구매했습니다.
#jeny님이 mac book intel를 구매했습니다.
#python님이 samsung notebook를 구매했습니다.
```
이전의 코드보다 훨씬 간결하면서 직관적인 코드가 완성되었습니다.

뿐만 아니라 사이드 이펙트에 대해서도 강점을 가지게 되는데, 이러한 이유는 zip은 **지연 계산 Generator**를 지원해주기 때문에 각 Iterator에서 각 값을 한 개씩 읽어오는 특징이 있습니다.

이러한 이유 때문에 대량의 데이터를 다루는 작업을 하는 로직에서도 zip을 사용하는 것이 효과적입니다.

또한 zip의 특징으로는 두 이터레이터 중 하나가 마지막 요소에 접근하게 되어 읽을 값이 없을 경우에 멈추는 특징이 있습니다. 여기서 Exception을 발생시키지 않음을 명심해야 할 것 같습니다.

```python
users = ["lion2me","jeny","python","JAVA"]
items = ["mac book m1","mac book intel","samsung notebook"]
for user,item in zip(users,items):
    print(f"{user}님이 {item}를 구매했습니다.")

#lion2me님이 mac book m1를 구매했습니다.
#jeny님이 mac book intel를 구매했습니다.
#python님이 samsung notebook를 구매했습니다.
```

두 이터레이터의 값을 모두 가져오고 싶다면? itertools의 itertools.zip_longest(iter1, iter2)를 사용하면 가능합니다.

```python
import itertools
users = ["lion2me","jeny","python","JAVA"]
items = ["mac book m1","mac book intel","samsung notebook"]
for user,item in itertools.zip_longest(users,items):
    print(f"{user}님이 {item}를 구매했습니다.")

#lion2me님이 mac book m1를 구매했습니다.
#jeny님이 mac book intel를 구매했습니다.
#python님이 samsung notebook를 구매했습니다.
#JAVA님이 None를 구매했습니다.
```

### 대입식을 사용해 반복을 피해라

왈러스 연산자에 대한 내용
