---
layout: post
title: Python Basic 5 - Class And Interface
date: 2022-04-09 21:05:23 +0900
category: Python
use_math: true
---

Python Basic 5 - Class And Interface 
---

## 클래스와 인터페이스

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 내장 타입을 여러 단계로 내포시키기보다 클래스를 합성하라

이 주제를 들으면 이해하기 어려 울 수 있지만, 저의 방식대로 요약하면 다음과 같이 말 할 수 있습니다.

**동적으로 값이 저장되는 로직을 설계할 때 동적으로 타입을 늘리지 않고, 고정적인 형태의 클래스를 사용해라.**

여기서 동적은 어떤 값이 입력 될 지 미리 알 수 없는 상태를 말합니다. 예를 들면 다음과 같은 상태를 말합니다.

```python
people = {}
people['lion2me'] = {}
people['lion2me']['name'] = "비밀?"
people['lion2me']['age'] = 27
```
원하는 만큼 동적으로 코드를 늘리고, 그 값은 people 변수에 입력되게 됩니다. 매우 편한 방법이고 파이썬의 dict의 효과가 좋다는 것은 잘 알려진 사실이지만, 코드를 보는 입장에서는 어려움을 느낄 수 있는 것을 쉽게 알 수 있습니다.

중요한 점은 **그래서 무슨 변수가 포함되어 있는데?**입니다. 우리가 DataFrame을 사용하는 이유가 바로 이런 이유라고 생각합니다. DataFrame을 사용하면 Column과 Row 형태를 유지함으로써 모든 정보에 접근할 수 있기 때문에 쉽게 전체 데이터의 형태를 파악 할 수 있습니다.
하지만 모든 데이터를 DF형태로 변환해서 사용 할 수는 없죠.

모든 딕셔너리에서 자체적으로 keys() 함수를 이용하면서 일일이 구조를 사용 할 것이 아니라면, 여기서는 **namedtuple의 사용과 dataclass를 권장합니다.**

이 후 사용 할 수 있는 부분이기에 간단한 예제를 적습니다.

```python
person = namedtuple('test',['name','grade','age','etc'])
person1 = person("lion2me","A",26,"etc..")
print(person1.name)

# lion2me
```

```python
from dataclasses import dataclass
@dataclass
class data:
    tmp1:str
    tmp2:str
    
tmp = data(tmp1 = 't1',tmp2 = 't2')
print(tmp.tmp1)
# t1
```

[Namedtuple과 dataclass의 차이점1](https://xfrnk2.github.io/python/comparison_namedtuple_and_dataclass/)

[Namedtuple과 dataclass의 차이점2](https://velog.io/@yoonkangho/pythonic-dataclass)

위 블로그의 내용을 정리하면, namedtuple은 tuple의 특성을 이용하고, dataclass는 dictionary의 특성을 사용하고 있습니다. 그래서 다음의 특징이 있습니다.

1. immutable, hashable, iterable, unpackable, comparable 과 같은 특성을 원하면 namedtuple을 사용하고, 상속과 빠른 access를 원한다면 dataclass를 하면 좋을 것 같습니다.
2. namedtuple은 Sequencial(iter or lt , gt 등)한 특성을 가진 값을 저장 할 때 좋고, 그 외에는 dataclass를 사용 하면 되는 것 같습니다. 기본적으로 \_\_eq\_\_와 같은 부분은 dataclass도 자동으로 생성해줍니다.


### 간단한 인터페이스의 경우 클래스가 아닌 함수를 받아라

파이썬에서 많은 수의 내장 API는 함수를 전달해서 동작을 원하는대로 바꿀 수 있도록 도와줍니다. 예를들면 sort의 경우에는 key라는 매개변수를 이용해서 원하는 조건에 맞게 정렬을 해줍니다.

```python
@dataclass
class Token:
    userid:str
    userpassword:str
    access:list
    
    @staticmethod
    def get_id_length(userid):
        return len(userid)
    
    @staticmethod
    def get_id_order(userid):
        return userid
```

위와 같은 dataclass를 생성 한 후 리스트에 담아 정렬하는 예제를 살펴보겠습니다.

```python
token_list = []

token_list.append(Token(userid="lion2me",userpassword='password1',access=['write','read']))
token_list.append(Token(userid="test2me",userpassword='password1',access=['write','read']))
token_list.append(Token(userid="test1me",userpassword='password1',access=['write','read']))
token_list.append(Token(userid="lio1me",userpassword='password1',access=['write','read']))

print( token_list )

''' [Token(userid='lion2me', userpassword='password1', access=['write', 'read']),
  Token(userid='test2me', userpassword='password1', access=['write', 'read']),
  Token(userid='test1me', userpassword='password1', access=['write', 'read']),
  Token(userid='lio1me', userpassword='password1', access=['write', 'read'])]'''
```

초기 리스트의 상태는 다음과 같습니다. 입력 된 순서대로 담겨있는 상태에서 미리 만들어놓은 함수를 이용해서 정렬을 해보겠습니다.

```python
token_list.sort(key = lambda x:x.get_id_length(x.userid))
print( token_list )

'''
[Token(userid='lio1me', userpassword='password1', access=['write', 'read']),
 Token(userid='lion2me', userpassword='password1', access=['write', 'read']),
 Token(userid='test2me', userpassword='password1', access=['write', 'read']),
 Token(userid='test1me', userpassword='password1', access=['write', 'read'])]
 '''
```
글자수로 정렬을 한 결과 lio2me가 가장 위로 올라온 뒤 다른 요소들의 정렬 순서는 바뀌지 않는 것을 볼 수 있습니다.

```python
token_list.sort(key = lambda x:x.get_id_order(x.userid))
print( token_list )

'''
[Token(userid='lio1me', userpassword='password1', access=['write', 'read']),
 Token(userid='lion2me', userpassword='password1', access=['write', 'read']),
 Token(userid='test1me', userpassword='password1', access=['write', 'read']),
 Token(userid='test2me', userpassword='password1', access=['write', 'read'])]
 '''
```
그리고 알파벳의 순서에 맞게 정렬을 한 결과는 다음과 같이 test1me이 위로 올라온 것을 확인 할 수 있습니다.

이렇듯 전달 한 함수를 실행 할 때 이런 함수들을 **훅**이라고 합니다. 훅으로 사용 할 수 있는 건 함수만 있는 것은 아닙니다. 함수를 선언 할 때 return 되는 값을 이용해서 이 후 작업을 실행하기 때문에 **__call__**을 이용해서 클래스를 함수처럼 사용하는 방식으로 훅으로 사용 할 수 있습니다.

하지만 굳이 어려운 작업이 아니라면 함수를 훅으로 사용하는 방식이 좋습니다. 코드의 간결성과 이해도를 높일 때도 도움이 됩니다.

책에서는 상태가 유지되는 ( 제 생각에는 Historical한 느낌의 ) 작업의 경우에는 별도의 클래스의 인스턴스를 이용해서 동작시키는게 낫다는 말을 하고 있습니다. 이런 작업을 하게 된다면, 그때 시도해보도록 하겠습니다.

### 객체를 제네릭하게 동작시킬 때 @classmethod 를 이용하자

책으로만 이해하기에 어려운 부분이 있는 듯해서 제가 별도의 예제를 만들어보겠습니다.

Tokenizer를 개발한다고 생각해보겠습니다. 가장 일반적으로 생각하는 방식은 다음과 같습니다.

```python
class Tokenizer:
    def __init__(self, data):
        self.data = data
    def tokenize(self):
        raise NotImplementedError
        
class TextTokenizer(Tokenizer):
    def __init__(self,text):
        super().__init__(text)
    
    def tokenize(self):
        text = list(map(lambda x:f'__{x}__', self.data.split(' ')))
        for word in text:
            yield word
```
충분히 깔끔한 코드라고 생각합니다만, 제네릭하지 않다는 문제가 있을 수 있습니다.
이런 문제점 때문에 @classmethod를 사용한다고 합니다. 위의 예제는 너무나도 쉬운 예제이지만, 저 코드들이 조금 더 세분화되어 만들어진다면 어려움이 생길 수도 있을 것 같습니다.

예를들면, 텍스트 한 줄에 적용 할 수 있도록 최적화 된 코드가 있다면? 여러 줄의 텍스트를 받는 함수의 경우 최적이지 않을 가능성이 있습니다.

이런 경우 결국 Tokenizer부터 하나하나 바꿔가야 하는 문제가 발생 할 수 있지만, 중간까지 동일하게 사용되는 클래스가 있다면 해당 클래스에서 이 후 동작을 수행하는 함수에 @classmethod를 사용한다면, 별도의 기능을 쉽게 구현 할 수 있습니다.

여기서 @classmethod와 @staticmethod의 차이를 알아보겠습니다.

어쩌면 이게 메인이네요.

@classmethod는 일단 cls라는 매개변수를 갖습니다. **cls는 상속을 받아 온 현재의 클래스를 말합니다.** 즉 현재의 클래스의 변수에 접근하는 것이고, 그 값을 변경하더라도 상속을 받은 부모 클래스에게는 영향을 끼치지 않습니다.

[classmethod와 staticmethod의 차이](https://techblog-history-younghunjo1.tistory.com/217)

위 링크에서 좋은 예제를 가져왔습니다.

```python
class Parent:
    name = 'Younghun Jo'

    @classmethod
    def change_name(cls, new_name):
        cls.name = new_name

class Child(Parent):
    pass 

parent = Parent()
child = Child()

parent.change_name('Heungmin Son')
print('부모 클래스에서 선언할 때:\n', parent.name, child.name)
print('-'*50)
child.change_name('Jisung Park')
print('자식 클래스에서 선언할 때:\n', parent.name, child.name)
print('-'*50)
parent.change_name('Heungmin Son')
print('부모 클래스에서 다시 선언할 때:\n', parent.name, child.name)
print('-'*50)
child.change_name('Heungmin Son')
print('부모 클래스에서 다시 선언할 때:\n', parent.name, child.name)

'''
부모 클래스에서 선언할 때:
 Heungmin Son Heungmin Son
--------------------------------------------------
자식 클래스에서 선언할 때:
 Heungmin Son Jisung Park
--------------------------------------------------
부모 클래스에서 다시 선언할 때:
 Heungmin Son Jisung Park
--------------------------------------------------
부모 클래스에서 다시 선언할 때:
 Heungmin Son Heungmin Son
''' 
```

여기는 statismethod와 classmethod의 차이를 알 수 있습니다. **cls는 현재의 클래스만을 이야기하고, 부모 클래스에서 선언을 할 때 자식 클래스에 해당 값이 없다면 같은 값으로 초기화 하는 것 같습니다.** 이 부분은 아마 상속으로 인한 이 후 작업에서 문제가 없도록 하는 듯 합니다.

두 방식 모두 클래스 변수에 접근 할 수 있다는 특징이 있습니다. self로 시작하는 인스턴스 변수에는 접근 할 수 없죠. 그래서 만약 **클래스 변수를 이용해서 코드를 작성한다면 classmethod와 staticmethod는 그 값을 초기화 하거나 사용하는데 좋은 방법**이 될 수 있습니다.

여기까지만 알면 충분 할 듯 합니다. 앞으로는 응용의 영역이겠죠.

### super로 부모 클래스를 초기화하라

기존의 부모클래스를 초기화 할 때 일일이 \_\_init\_\_함수를 사용하곤했습니다. 하지만 그렇게 할 경우 다이아몬드 상속일 경우 문제를 발생 시킬 수 있습니다.

여기서 다이아몬드 상속은 한 클래스에서 파생 된 둘 이상의 자식 클래스가 다시 한 클래스에 상속하는 경우 그 구조가 다이아몬드와 같다는 의미로 지어진 이름입니다. 이 경우 어려운 점이 있습니다.

1. 최상위 클래스의 초기화는 2번 이상 발생
2. 어떤 클래스부터 상속?

클래스를 상속 받는 순서에 따라서 초기화 결과가 달라질 수 있습니다. 주로 같은 인스턴스 변수나 클래스 변수에 접근 할 경우 이런 일이 발생 할 것 같습니다.

그래서 super를 이용한 상속을 권장합니다.

어떤 클래스부터 상속을 받을 것 인지 순서를 매기기도 해주고, 동시에 다이아몬드 상속의 경우에도 부모 클래스를 단 한 번만 초기화 해줍니다.

### 기능을 합성 할 때는 믹스인 클래스를 사용하라

믹스인 클래스라는 개념을 설명하지만 실제로는 특정한 기능이 담긴 클래스를 상속받아서 사용하자는 이야기 입니다. 책에서 설명하는 이야기는 **객체를 Dictionary로 변환하는 기능**을 클래스로 작성해서 자체적으로 변수의 타입을 확인하고 알맞은 방식으로 파싱해서 Dictionary화 시키는 코드를 보여줍니다.

이 외에도 많은 예제가 있을 것 같습니다. 컴퓨터비전을 다루는 개발자에게는 이미지를 동일한 크기로 압축하는 로직이 모든 이미지 파싱관련 클래스에 있었으면 좋겠다는 생각을 할 수 있습니다. 텍스트 분석이라면 단어 갯수를 리포팅해주는 클래스가 있으면 좋겠네요.

### 비공개 애트리뷰트보다는 공개 애트리뷰트를 사용하라

**파이썬은 protected 변수의 경우에는 앞에 _를 붙입니다. 그리고 private 변수에는 앞에 \_\_를 붙입니다만, 실제로 이 값이 외부에 알려지지 않는다는 것은 아닙니다.** 일반적으로 \_를 사용 한 변수의 경우에는 다른 개발자들에게 **\"이 값은 조심히 사용해야합니다.\"** 라는 말을 할 수 있습니다. 하지만 굳이 private를 표기해야하는가는 논란이 있다고 합니다.

private 형식을 사용하면 정확한 명칭으로 외부에서 접근 할 수 없습니다. 예를 들면 다음과 같이 자식 클래스에서 부모 클래스의 값을 가져올 때 에러가 발생하는 것을 볼 수 있습니다.

```python
class MyParentObject:
    def __init__(self):
        self.__private = 51

class MyChildObject(MyParentObject):
    def get_private(self):
        return self.__private

a = MyChildObject()
print(a.get_private())

# AttributeError: 'MyChildObject' object has no attribute '_MyChildObject__private'
```

하지만 접근 할 수 없는 것은 아닙니다. 다음의 출력을 사용하면 원하는 변수에 접근 할 수 있습니다.

```python
a = MyChildObject()
print(a._MyParentObject__private)

# 51
```
즉 파이썬에서 말하는 private는 변수 명을 이용해서 정의 된 변수 명으로 접근 할 수 없도록 제한하는 정도만을 말합니다. 겉으로 보기에는 제한하지만, 결국 누구나 접근 할 수 있는 형태입니다.

그러니 딱히 변수명이 겹칠 때가 아니라면 private는 사용 할 필요가 없다고 합니다.

### 자체적으로 커스텀 컨테이너를 만들때는 collections.abc 를 상속하라.

개발을 하다보면 자체적으로 list나 dict와 같은 컨테이너로는 문제가 해결되지 않을 수 있습니다. 그 때는 자체적으로 컨테이너를 만들어야하는 상황이 생길 수 있는데, 이 때 유용하게 사용 할 수 있는 방법으로 collections.abc를 상속하는 방법이 있습니다.

컨테이너는 일반적으로 내부에 여러 기능이 만들어져 있어야 합니다. 예를들면 인덱싱을 할 때는 **\_\_getitem\_\_** 함수가 정의되어 있어야 하고, 요소의 전체 크기를 나타내는 **\_\_len\_\_** 함수 등이 있어야 합니다.

그 외에도 count, index 등 다양한 함수가 있기 때문에 기본적으로는 컨테이너를 자체적으로 만드는 것 자체가 쉬운 일은 아닙니다.

하지만 collections.abc는 컨테이너를 정의 할 때 꼭 구현되어야 하는 부분에 대해서 짚어주고, 정의 된 함수의 동작에 따라 어느정도의 함수를 자동으로 만들어줍니다.

추가적으로 정말 간단한 컨테이너 ( list, dict에 추가적인 기능을 추가 한 컨테이너 )를 만들때는 바로 상속 받아서 추가해주어도 됩니다.

### 참고


