---
layout: post
title: Python Basic 6 - Meta Class And Attribute
date: 2022-04-12 21:05:23 +0900
category: Python
use_math: true
---

Python Basic 6 - Meta Class And Attribute
---

## 메타 클래스와 애트리뷰트

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 세터와 게터 대신 평범한 애트리뷰트

자바와 같은 언어, 특히나 캡슐화가 잘 구현되어 있는 객체지향 언어에서는 주로 세터와 게터를 이용해서 속성을 얻어오는 방식이 사용됩니다. 일반적으로 **애트리뷰트에 접근을 제한하고 값을 이용하기 위해서 사용**됩니다.

하지만 파이썬에서는 **private나 protected 등 접근제한자를 강하게 제공하지 않습니다.**, 오픈소스를 보면 \_로 표시 되어 있는 메서드를 많이 볼 수 있습니다. 이러한 특징은 protected를 표현 한 것이지만, 실제로 어떤 접근 클래스든 해당 값에 접근 할 수 있습니다. 즉 **protected는 명시적으로 표현 할 뿐 접근 할 수 있습니다.** 

마찬가지로 private도 \_\_를 명시적으로 붙여주고 접근 할 때 동일한 변수 명으로는 접근 할 수 없지만, 변수는 클래스의 애트리뷰트에 생성되어 있음을 알 수 있습니다.

```python
class capture_test:
    def __init__(self):
        self.__a = "private"
        self._b = "protected"
        self.c = "public"
        
a = capture_test()
a.__dict__

{'_capture_test__private': 'private',
 '_protected': 'protected',
 'public': 'public'}
 
```

정확히 말하면 \_\_를 이용해서 private를 표현 한다고 해도 클래스 명을 이용해서 애트리뷰트 이름을 바꿀 뿐 접근이 안되는 것은 아닙니다.

그러니 만약 **"이 변수는 자식 클래스에서 변형하면서 기능의 차이를 줄 수 있는 트리거로 사용 할거야!"** 라고 생각하더라도 굳이 getter에 protected를 표현 할 필요가 없습니다. ( 이후 코드 확인을 위해 변수 명에는 \_를 붙이는 것은 좋은 것 같습니다. )

그래도 이런 문제는 있을 수 있습니다.

**"학생에게 점수를 줄 때 100점보다 많이 주면 안되는데?"** 이러한 예외가 일어나지 않도록 프로그램을 설계할 때도 setter가 이용되기도 합니다. 혹은 getter에서 정보를 불러오는 시점에도 별도의 이벤트가 발생 할 수도 있습니다.

다음 장의 @Property에서 방법을 정리해보겠습니다.

 
### 애트리뷰트를 일일이 리펙터링하지말고 @Property 고려

이전 장에서 파이썬에서 다음과 같은 코드는 지양한다고 말했습니다.

```python
def get_attr1(self):
    return self.a
def set_attr1(self,value):
    self.a = value
```

그럼 어떻게 바꿀 수 있을까요?

파이썬에서는 이러한 기능을 할 수 있는 데코레이터를 제공하고 있습니다. 그 데코레이터가 바로 @property입니다. 설명하기보다 간략한 예제를 먼저 보겠습니다.

```python
class score:
    def __init__(self, value):
        self._score = value
    
    @property
    def score(self):
        return self._score
    
    @score.setter
    def score(self,value):
        self._score = value
    
    
a = score(89)
print(a.score)
a.score = 32

# 89
# 32
```
여기서 주목 할 부분은 **print를 한 속성값이 @property로 묶은 함수 명이라는 것과 그러한 score를 설정 한 부분이 score.setter라는 것** 입니다.

즉 @property는 정확히는 특정 애트리뷰트를 getter로 만드는 것이 아닌 **또 하나의 애트리뷰트를 만드는 것**이라고 생각하면 편합니다. 대신 그 용도가 **애트리뷰트를 이용 한 값을 리턴함**을 확실히 하면 됩니다.

그리고 setter의 경우에는 해당 property의 \.setter를 데코레이터로 사용하면 됩니다. 만약 @property로 애트리뷰트를 만들어놓고 setter를 만들지 않으면 해당 애트리뷰트로 값을 변경 할 수 없습니다.

```python
class score:
    def __init__(self, value):
        self._score = value
    
    @property
    def score(self):
        return self._score
        
a = score(89)
print(a.score)
# 89

# a.score = 32
# error

# a._score = 32
# 이런 식으로 변수에는 접근 할 수 있다.
```

이걸 이용해서 점수가 100점 이상이 되지 않도록 해보겠습니다.

```python
class score:
    def __init__(self,first_name, last_name):
        self._score = 0
        self._first_name = first_name
        self._last_name = last_name
    
    @property
    def score(self):
        return self._score
    
    @property
    def full_name(self):
        return f"{self._first_name}_{self._last_name}"
    
    @score.setter
    def score(self,value):
        # try : except : 로 예외처리도 가능
        if value < 0:
            value = 0
        elif value > 100:
            value = 100
        self._score = value
    
    
a = score("lion2","me")
a.score = 134
print(a.score)
a.score = -5
print(a.score)
print(a.full_name)

# 100
# 0
# lion2_me
```

여기서 만약 try / except로 예외 처리를 한다면 더욱 유연하게 활용 할 수 있습니다. @property를 이용한 getter 또한 출력하고자 하는 값을 유연하게 정할 수 있습니다. first_name과 last_name을 이용한 fullname이라는 새로운 property를 만들어내는 것을 보면 유연하게 활용 할 수 있음을 알 수 있습니다.

**하지만 property를 이용해서 속성을 불러오는 과정이 너무 많은 자원을 사용하게 된다면 예상치 못한 문제를 겪을 수 있습니다.** 예를 들면 값을 불러 올 때마다 디스크에서 불러오는 IO작업이 수행되거나 DB에서 값을 가져오는 등 네트워크 IO가 실행되어버리면 해당 값을 여러 번 접근하는 로직이 수행 될 때 큰 문제가 발생 할 수 있습니다.

이럴 때는 **메서드를 작성**하도록 하는게 좋다고 합니다.

### @Property에만 의존하지말고 디스크립터를 사용 고려

이전 챕터에서는 property의 유용함에 대해서 말씀드렸지만, 사실 property의 문제점이 하나 있습니다. 바로 **재사용성**입니다. score 클래스의 \_score 애트리뷰트를 property를 이용하여 getter와 setter를 만들 수 있었던 이유는 우리가 score라는 변수가 있음을 알고 있었기 때문입니다.

만약 모든 변수에 대해서 이러한 getter / setter를 설정한다면 애트리뷰트를 늘리는 것에 상당한 부담을 느낄 것 같습니다. 뿐만아니라 코드도 길어지는 문제가 발생합니다.

Spring에서 Lombok을 이용해서 어노테이션 형태로 해결했던 것과 마찬가지로 파이썬또한 이러한 문제를 해결 할 수 있는 방안이 있습니다.

그 방안은 특정 애트리뷰트를 클래스로 묶은 뒤 \_\_get\_\_와 \_\_set\_\_을 정의하는 것입니다. 그 뒤 하나의 데이터 클래스로 묶어서 사용하면 편하게 구현 할 수 있습니다.

```python
class name:
        
    def name_check(self,name):
        if len(name) > 10:
            raise ValueError("이름은 10글자를 넘길 수 없습니다.")
    
    def invalid_name_check(self,names):
        if len(names) != 2 or type(names) != list:
            raise ValueError("성과 이름에 공백을 두고 입력해주세요")
    
    def __get__(self, instance, instance_type):
        return f"{first_name} {last_name}"
    
    def __set__(self, instance, value):
        name = value.split(' ')
        self.invalid_name_check(name)
        self.name_check(' '.join(name))
        self._first_name = name[0]
        self._last_name = name[1]
        

class person:
    name = name()
    math_score = score()
    korean_score = score()
    english_score = score()
    def __init__(self, first_name, last_name):
        self.name = f"{first_name} {last_name}"
        
    
my_stats = person("lion2","me")
my_stats.math_score = 100
print(my_stats.math_score)
my_stats.name = "lion2 Mk2"
print(my_stats.name)
my_stats.name = "lion2me"

#100
#lion2 Mk2
#ValueError: 성과 이름에 공백을 두고 입력해주세요

```
이런 식으로 사용하면 될 것 같습니다.

### 지연 계산 애트리뷰트가 필요하면 \_\_getattr\_\_ \_\_setattr\_\_ \_\_getattribute\_\_ 를 고려

\_\_getattr\_\_ 메서드는 **해당 객체의 인스턴스 딕셔너리에서 찾을 수 없는 애트리뷰트에 접근 할 때마다 호출**됩니다. 만약 가져오고자 하는 애트리뷰트가 이미 존재하면 여러 번 동작하지 않습니다.

\_\_getattribute\_\_ 메서드는 **해당 객체의 어떠한 애트리뷰트에 접근을 하든 호출**됩니다. 존재하는 애트리뷰트를 불러 올 때도 호출되기 때문에 return에 자신이 속한 클래스의 애트리뷰트에 접근하면 무한루프의 가능성이 높습니다. 부모 클래스의 속성에 넣는 방법으로 예방 할 수 있습니다.

\_\_setattr\_\_ 메서드는 **해당 객체의 어떠한 애트리뷰트에 값을 변경 할 때 항상 호출됩니다.**

이 부분은 그냥 예제로 가져온 코드를 보여주는게 좋을 것 같습니다.

```python
class A(object): 
     
    def __init__(self): 
        self.__v = bytearray(sorted("Hi".encode(), reverse=True)).decode() 
     
    @property 
    def value(self): 
        return self.__v 
     
    @value.setter 
    def value(self, value): 
        self.__v = value 
         
    def set(self, value):
        print("A's set")
        self.__v = value 
     
    def get(self): 
        return self.__v 
 
 
class Proxy(object): 
     
    def __init__(self, o): 
        object.__setattr__(self, "_o", o) 
        self.__v = "Proxy"
        self.tmp = "tmp"
     
    @property     
    def proxy(self): 
        return self.__v 
     
    @proxy.setter 
    def proxy(self, value): 
        self.__v = value 
     
    def __getattr__(self, name): 
        print("getter action")
        return getattr(object.__getattribute__(self, "_o"), name) 
     
    def __setattr__(self, name, value): 
        print("setter action")
        if name == "proxy": 
            return object.__setattr__(self, name, value) 
         
        return setattr(object.__getattribute__(self, "_o"), name, value) 
 
 
def main(): 
    print("0. initialize class")
    a = A() 
    p = Proxy(a) 
    print()
    print("1. p.value : %s" % p.value)     
    s = "Hi" 
    print()
    print("2. p.value = %s" % s) 
    print()
    print("3. p.value's set")
    p.value = s 
    print()
    print("4. p.value : %s" % p.value) 
    print()
     
    print("5. p.proxy : %s" % p.proxy) 
    print()
    s = bytes(sorted("Proxy".encode(), reverse=True)).decode()
    print()
    print("6. p.proxy = %s" % s) 
    print()
    print("7. s into p.proxy")
    p.proxy = s 
    print()
    print("7. p.proxy : %s" % p.proxy) 
    print()

    print("8. p.proxy : %s" % p.tmp) 
    print()

    print(f"9. {p.__dict__['_o']}")
    
    print()
    p.test = 10
    print(f"10. {p.test}")
    
if __name__ == "__main__": 
    main()
    
# 0. initialize class
# setter action
# setter action

# getter action
# 1. p.value : iH

# 2. p.value = Hi

# 3. p.value's set
# setter action

# getter action
# 4. p.value : Hi

# getter action
# 5. p.proxy : Proxy


# 6. p.proxy = yxroP

# 7. s into p.proxy
# setter action
# setter action

# getter action
# 7. p.proxy : yxroP

# getter action
# 8. p.proxy : tmp

# 9. <__main__.A object at 0x7fde78180760>

# setter action
# getter action
# 10. 10
```

### __init_subclass__를 이용

Meta 클래스를 작성하면 클래스를 정의하는 순간 실행되는 로직을 작성 할 수 있습니다. 즉 **어떠한 클래스를 import 하는 시점부터 유효성을 검증하고 예외 처리를 할 수 있게 됩니다.**

```python
class Meta(type):
    def __new__(meta, name, bases, class_dict):
        print(f"* 실행: {name}의 메타 {meta}.__new__")
        print("기반 클래스 : ",bases)
        print(class_dict)
        return type.__new__(meta,name,bases,class_dict)
    
class MyClass(metaclass=Meta):
    stuff = 123
    def foo(self):
        pass
    
class MySubClass(MyClass):
    other = 567
    def bar(self):
        pass
        
# * 실행: MyClass의 메타 <class '__main__.Meta'>.__new__
# 기반 클래스 :  ()
# {'__module__': '__main__', '__qualname__': 'MyClass',  'stuff': 123, 'foo': <function MyClass.foo at  0x7fa6aa5cf1c0>}
# * 실행: MySubClass의 메타 <class '__main__.Meta'>.__new__
# 기반 클래스 :  (<class '__main__.MyClass'>,)
# {'__module__': '__main__', '__qualname__':  'MySubClass', 'other': 567, 'bar': <function  MySubClass.bar at 0x7fa6aa5ce170>}
```

Meta에서 Exception처리를 하면 조건에 맞지 않은 클래스는 정의조차 못하게 할 수 있습니다.

이 방식은 파이썬 표준 메타클래스 정의 방식이지만, 여러 개의 메타클래스를 정의 할 수 없고, 비록 하더라도 좋지않은 코드가 나올 가능성이 높습니다.

그래서 파이썬 3.6 이상에서는 \_\_init_subclass\_\_ 사용 권장합니다.

\_\_init_subclass\_\_ 를 사용하면 일반적으로 사용하는 클래스 상속으로 여러 메타클래스를 사용 한 유효성 검사와 같은 작업을 할 수 있습니다.

사용방법 또한 metaclass를 별도로 지정하는게 아니라 상속 받으려는 클래스의 \_\_init_subclass\_\_를 사용하기 때문에 이해하기도 쉽습니다.

명심해야 하는 부분은 **메타클래스의 검증은 클래스의 모든 본문이 끝난 뒤에 호출**된다는 점입니다.


### __init_subclass__를 이용해서 확장

어느정도 알겠지만, 굳이? 라는 생각이 듭니다.

### __set_name__을 이용해서 클래스의 프로퍼티 이름 처리 가능

1. Field 클래스의 init으로도 가능 하지만 중복이 있습니다.
2. 메타클래스를 이용해서 클래스 정의 시점에서 동작을 수행 할 수 있습니다.
3. Field 클래스에서 __set_name__을 이용하면 별도의 수행 없이 프로퍼티를 처리 가능합니다.

이 부분은 특정 클래스의 애트리뷰트의 속성 값 ( 정확히는 객체의 \_\_dict\_\_의 키 값)을 다룰 때 유용할 것 같습니다.

### 클래스 데코레이터를 이용해서 모든 메서드나 애트리뷰트를 변경

이 부분은 많은 사용이 될 수 있는 부분이기 때문에 적어보겠습니다.

일반적으로 **어떤 동작을 수행 할 때 특정한 로직을 추가하기 위해서 우리는 데코레이터를 사용**합니다. 예를들면 어떠한 딕셔너리를 리턴하는 메소드를 RDB에 입력하기 위해 Parsing하는 데코레이터를 추가해서 편하게 SQL문으로 만들어주거나 할 수 있죠.

일반적으로 함수를 데코레이터로 사용했었지만 클래스도 데코레이터로 사용 할 수 있습니다.

이전에 만들었던 \_\_init\_subclass\_\_를 정의 한 클래스를 데코레이터로 추가하면 이전까지의 설정들을 쉽게 사용 할 수 있습니다.

책의 예제에서는 tracking하는 로직을 모든 메서드에 추가했습니다.

