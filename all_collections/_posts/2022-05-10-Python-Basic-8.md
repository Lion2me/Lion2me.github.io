---
layout: post
title: Python Basic 8 - 강건성과 성능
date: 2022-05-10 21:05:23 +0900
category: Python
use_math: true
tags:
- Python
- 파이썬
---

Python Basic 8 - 강건성과 성능
---

## 강건성과 성능

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### try / except / else / finally

우리는 일반적으로 try except finally는 알고 있습니다. 하지만 else? 이 부분은 사실 다른 언어에서 보지 못한 것이기 때문에 한번 짚고 넘어가고자 합니다.

**else는 try가 성공적으로 동작하고 난 후 실행되는 구간입니다.** 이 의미는 상당히 의미가 있어보입니다. 일단 else의 경우에는 except를 넘어 간 후이기 때문에 raise를 통해 Exception을 발생 시키더라도 예외처리가 되지 않습니다.

예를 들면 우리가 파일을 열고 작업하는 과정을 진행한다고 해보겠습니다. 특별한 방법을 사용하지 않고 동작을 수행하게 되면 다음과 같이 수행 될 것 입니다.

```
try : 파일을 연다 ( 파일이 없을 경우 Exception )

except : 에러 처리

finally : 파일을 닫는다
```

그럼 만약 파일에 내용을 적는 도중에 에러가 발생한다면 어떻게 될까요? zero division이 발생 할 수 있는 예시를 들어보겠습니다.

```
try : 파일을 연다 ( 파일이 없을 경우 Exception )

except : 에러 처리

else : x/0

finally : 파일을 닫는다

위 동작을 수행하는 함수의 except : Exception Zero Division 처리
```

이렇게 동작 할 수 있습니다. 굳이 함수를 처리하는 단계의 예외 처리에서 여러가지의 경우의 수로 생각 할 필요 없이 필요한 만큼의 예외만 처리해주면 코드는 간결하고 에러는 명확하게 잡아 낼 수 있습니다.

else가 동작하더라도 finally는 수행됩니다. 즉 파일을 닫지않아 메모리 누수는 발생하지 않습니다.

### 재사용 가능한 try / finally 동작을 원한다면 contextlib과 with 문을 사용하라

with는 우리가 파일을 다룰 때 자주 사용됩니다. 그 외에도 DB에 접근 할 때도 자주 사용하네요. 하는 일은 단순히 위에서 수행 한 파일의 여닫기 혹은 DB 세션의 생성과 해제라고 생각하면 됩니다.

이 부분은 실제 구현문을 보는게 가장 빠른 이해라고 생각되어 예시를 적어두겠습니다.

```python
from contextlib import contextmanager

# 데코레이터 contextmanager는 with으로 접근할 수 있도록 만들어준다.
@contextmanager
def debug_logging(level):
    logger = logging.getLogger()
    old_level = logger.getEffectiveLevel()
    logger.setLevel(level)
    try:
        yield
    finally:
        logger.setLevel(old_level)
```
이 함수는 로그의 레벨을 올려주는 코드 입니다.

가장 좋은 예시인 것 같아 코드를 계속 작성해보면

```python
import logging
def my_function():
	logging.debug('디버깅 데이터')
	logging.error('이 부분은 오류 로그')
	logging.debug('추가 디버깅 데이터')
	
my_function()

# 이 부분은 오류 로그 만 출력

with debug_logging(logging.DEBUG):
	my_function()
	
# 디버깅 데이터
# 이 부분은 오류 로그
# 추가 디버깅 데이터

```

### time은 datetime을 사용하라

운영체제 별로 time을 다루는 방식의 차이가 있을 수 있다. shell을 사용하다보면 Mac에서는 gdate를 리눅스에서는 date를 사용하는 차이가 있을 수 있고, 지원하지 않는 timezone도 있을 수 있다.

하지만 datetime을 이용하면 PST에서 UTC로 UTC에서 KST로, UTC를 기준으로 원하는 지역에 대한 모든 timezone 설정이 가능하다.

### copyreg를 사용해서 pickle 안정화

먼저 [pickle과 json의 차이](https://ugaemi.com/python/Python-json-pickle-marshal/)를 알아보자

pickle은 바이트 기반 직렬화 방식이고 json은 텍스트 기반 직렬화 과정이다. 따라서 pickle은 외부 사용자가 본다고 해도 읽을 수 없는 이진 파일이 된다.

pickle은 파이썬에서만 사용 할 수 있다. json은 다른 언어 혹은 환경에서 쉽게 사용 될 수 있다.

추가적으로 pickle은 신뢰 할 수 있는 서비스에 제공 할 때 사용되어야 한다. 이유는 **pickle로 직렬화 된 파일을 역직렬화 할 수 있는 정보가 파일 내부에 존재하기 때문**이다. 그리고 버전이 업그레이드 되거나, 변경이 있을 시 이전 버전의 pickle 파일은 사용 될 수 없다.

하지만 다른 버전이더라도 어떻게든 사용 할 수 있는 방법이 있는데, 그건 copyreg를 이용하는 방식이다.

이 부분은 방법론 정도만 이해를 마친 뒤 사용 할 일이 있다면 그 때 책을 참고해도 괜찮을 것 같다.

### 정확도가 중요 한 실수를 사용 할 때 decimal을 사용하라

Decimal 클래스는 28번째 자리 수까지 고정소수점 연산을 제공한다.

### 최적화하기 전에 프로파일링

프로파일링을 처음 알게 되어 적습니다.

파이썬에서는 cProfile과 profile 이 두 가지의 프로파일링 라이브러리를 제공합니다. 해당 명령어를 수행하는 시간과 호출 횟수 등을 알아 볼 수 있습니다.

### 생산자 - 소비자 큐로 deque를 사용

정확히는 **내장 list타입을 이용해서 queue 작업을 구현하지 말자** 라고 말 할 수 있다. list는 기본적으로 stack의 구조를 가지고 있으며, append와 pop을 이용해서 과정을 수행 할 때 pop(0)의 수행시간이 선형에 가깝기 때문에 가능하면 deque을 사용하는게 좋을 것 같다.

### 정렬되어 있는 값들은 bisect를 사용해라

시퀀스처럼 작동하는 객체의 경우 ( 리스트 등 ) 이진탐색을 사용해서 문제를 해결하는 것이 훨씬 빠르다.

### 우선순위 큐로 heapq를 사용하면 더욱 좋다.

### bytes를 복사하지 않고 다루려면 memoryview와 bytearray를 사용하라

실제로 사용 할 일이 있을지 모르지만, 영상이나 이미지, 게임 등 다양하게 bytes 형태로 전달되어지는 데이터를 memoryview와 bytearray를 사용하면 더욱 효과적으로 다룰 수 있다고 한다.




