---
layout: post
title: Python Basic 7 - 동시성과 병렬성
date: 2022-05-10 21:05:23 +0900
category: Python
use_math: true
tags:
- Python
- 파이썬
- 동시성
- 멀티스레드
- 멀티프로세스
- 파이썬 동시성
- 파이썬 병렬

---

Python Basic 7 - 동시성과 병렬성
---

## 동시성과 병렬성

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 자식 프로세스를 관리하기 위해 subprocess를 사용하라

파이썬은 인터프리터 언어이지만 멀티 프로세스와 멀티 스레드를 사용 할 수 있습니다. 하지만 언젠가 이런 말을 들은 적이 있습니다.

**\"파이썬에서 멀티 스레드를 사용하는건 많은 고민이 필요하다.\"**

원래는 멀티 스레드를 먼저 알아보는게 옳습니다. 대부분의 언어 학습에서도 멀티 스레드의 효율이  자주 듣습니다만, 파이썬의 경우 멀티 프로세스에 대해서 먼저 알아보는게 좋을 것 같습니다. 멀티 스레드와 멀티 프로세스에 대한 이해는 충분히 있다는 가정에서 시작하겠습니다.

```python
import subprocess

result = subprocess.run(['echo', '자식 프로세스가 보내는 인사! Hi'],
					capture_output = True,
					encoding = 'utf-8')
					
result.check_returncode()
print(result.stdout)
```
위의 코드는 책에 쓰여진 멀티 프로세스의 기본 코드입니다. 간략한 코드이기 때문에 설명을 붙이면, subprocess를 만들고 실행시키는 run 메서드를 사용합니다. 첫 번째로 입력 된 파라미터의 경우에는 리스트는 cmd 명령어를 공백 기준으로 담고 있습니다.

```python
import time
import subprocess

start = time.time()
sleep_procs = []

for _ in range(10):
    proc = subprocess.Popen(['sleep','1'])
    sleep_procs.append(proc)
    
for proc in sleep_procs:
    proc.communicate()
    
end = time.time()
delta = end - start
print(f"{delta:.3}초 걸림")

# 1.09초 걸림
```

위의 코드또한 비슷한 문장이지만 조금 더 설명을 덧붙여보면 파이썬의 subprocess에 대해서 잘 알 수 있을 것 같습니다.

먼저 Popen() 함수는 새로운 자식 프로세스를 만드는 함수입니다. 자식 프로세스를 만들어도, timeout이 일어나기 전까지는 해당 프로세스를 컨트롤하기 위해서 객체를 저장해야 합니다. 그러한 이유로 보통 큐를 이용하게 되는데, 여기서는 굳이 큐를 이용하지않고 리스트로 담아 앞에서부터 작업을 실행하는 방식으로 구현했습니다.

**하지만 일반적으로는 큐를 이용하는게 맞습니다.** 이유는 조금 더 직관적으로 알 수 있는데, 실행 순서가 먼저 수행 한 프로세스가 먼저 읽어지는 것이 순서 상 직관적이기 때문입니다. 하지만 순서대로 작업이 끝난다는 것은 아닙니다. 그저 그게 순서 상 옳다는 것 뿐이죠.

일단 위의 예제로 돌아가겠습니다. 각 프로세스는 **sleep 1** 이라는 명령을 가지고 생성됩니다. 이 경우 이전의 예제와 동일하게 cmd 명령어 입니다. 그리고 정의 된 프로세스를 모두 리스트에 담아서 communicate() 메서드를 사용해서 실행시켜주면 각 프로세스는 sleep 1 명령을 수행하게 됩니다.

보통 여기서 설명이 끝나지만 저는 조금 더 깊게 들어가보겠습니다.

####communicate가 무엇인가?

저는 처음 이 부분에서 어려움을 겪었습니다. subprocess 그리고 멀티 프로세스에 깊은 지식이 없는 사람은 이 함수에서 어려움을 겪을 수 있을 것 같습니다.

**communicate는 간단히 말하면 자식 프로세스와 통신하는 것** 입니다. 여기서 통신이라는 키워드는 결국 **데이터를 전송**한다고 말하면 좋을 것 같습니다. 특정 서비스들에 API 형태로 동일한 JSON 형태의 정보를 보내는 행동을 한다면 부모 프로세스에서 만드는 자식 프로세스의 수는 곧 **전송 할 서비스의 수** 일 것이고, 보내는 JSON 형태의 데이터는 동일한 형태의 JSON 파일 일 것 입니다.

**그러면 자식 프로세스는 어떻게 데이터를 받을까요?**

Popen()의 파라미터 중 stdin가 있습니다. 원하는 값을 입력 받을 수 있지만 프로세스 간 통신(IPC)을 하기 위해서는 PIPE로 설정해야합니다. 마찬가지로 결과를 부모 프로세스에게 보내기 위해서는 stdout 또한 PIPE로 설정해야합니다.

communicate 메서드는 2가지 파라미터를 가지고 있는데, 보낼 데이터와 timeout 시간입니다. 올바르게 설정되어있는 프로세스에게 데이터를 전송해서 원하는 결과를 ( output, error ) 형태로 보내주기 때문에 쉽게 사용 할 수 있습니다.

### 블로킹 I/O의 경우 스레드를 사용하고 병렬성을 피하라

**\"파이썬에서 멀티 스레드를 사용하는건 많은 고민이 필요하다.\"** 라고 말했습니다. 하지만 블로킹 I/O에서는 스레드를 사용하라고 말하고 있습니다.

왜 블로킹 I/O는 스레드를 사용하는게 효과적일까요? 이 의문을 풀기 위해서는 **GIL을 알아야 합니다.** 

#### GIL이 무엇인가?

먼저 GIL에 대해서 알아봅시다. **GIL은 Global Interpreter Lock의 약자로 파이썬에서 한 스레드만이 바이트코드를 실행 할 수 있도록 제한**하는 파이썬에서 사용하는 락입니다. 멀티 스레드는 곧 여러개의 스레드를 동시에 사용하는 방식으로 동작합니다. 하지만 어차피 파이썬에서는 한 스레드만이 동작하기 때문에 여러 스레드를 사용하는게 도움이 되지 않을 뿐더러 컨텍스트 스위칭이 일어나면 그 또한 어느정도의 성능 차이를 유발 할 수 있기 때문에 성능이 악화 될 수 있습니다.

그리고 멀티 스레드는 메모리 공간 중 **스택**을 별도로 사용하여 메모리적으로도 절약한다는 장점이 있었습니다. 하지만 파이썬의 변수 체계는 일반적인 언어에서 지역변수를 저장하듯 변수를 생성 할 때 메모리 공간을 새로 할당하고 그 값을 저장하는 방식이 아닌 **값을 저장 한 공간에 메모리 주소를 가져오는** 방식으로 동작합니다.

파이썬에서 멀티 스레드를 사용한다고해서 메모리적인 효과를 얻을 수 없습니다. 오히려 문제가 될 수 있습니다. 다른 스레드에서 해당 위치의 값을 변형시켜버리면 그 후 로직에 문제가 발생 할 수 있습니다.

**즉 모든 변수는 객체입니다.**

### GIL은 왜 태어났는가?
파이썬은 Referance Count 를 기반으로 변수를 처리합니다. 이 방식을 간단히 설명하자면, 다음의 순서로 메모리를 할당 및 해제하는 방식입니다.

1. 변수를 선언하면 메모리 공간(힙 영역)을 할당한다.
2. 해당 공간의 Referance Count를 0으로 초기화한다.
3. 메모리에 값을 저장한다.
4. 변수 명이 해당 위치를 가리키는 id를 가리키도록 한다.
5. 해당 변수를 가리키는 Referance Count를 1 증가시킨다.
6. 변수가 다른 값을 참조하거나 초기화 되면 Referance Count를 1 감소시킨다.
7. Referance Count가 0이 되면 GC의 대상이 된다.

이 때 멀티 스레드를 사용하면 문제가 있습니다.

**"Referance Count가 전역적으로 사용된다면, 두 스레드에 동시에 접근 한 후 인터럽트로 인해 Referance Count가 0이 되는 순간이 생기면? 그 때 GC의 대상이 되어버리면 어떻게 하지?"**

상상만해도 끔찍한 일이 발생합니다. 모든 스레드에서 처리 할 자원이라면 핵심적인 자원일 것일텐데 그 값이 인터럽트로 인해 ( 자원 할당과 자원 반납 과정 중 인터럽트 문제로 인해 ) 이 후 모든 스레드에서 해당 자원을 사용 할 수 없게 되버립니다. 결국 우리는 선택해야 합니다.

1. Referance Count에 락을 걸 것인가?
2. 인터프리터 자체에 락을 걸 것인가?

Referance Count에 락을 걸게 되면 우리가 사용하는 모든 변수에 대한 락이 걸리게 됩니다. 어떤 변수가 어떤 스레드에서 사용 될 지 모르기 때문에, 모든 변수를 사용 할 때 모든 스레드의 상태를 살펴봐야 합니다. 아마 파이썬 괴수분들도 이러한 작업을 오버헤드 없이 처리하기에는 엄청난 코딩능력과, 어쩌면 불가능 할 지 모릅니다.

그래서 우리는 인터프리터에 락을 겁니다. 구현도 간단하고, 멀티 스레딩의 효율만을 포기하면 안정성을 얻을 수 있기 때문입니다.

[GIL에 대한 좋은 글](https://seoyeonhwng.medium.com/python-global-interpreter-lock-gil-이란-2e519d4491a1)

### 예제

```python
import subprocess
import time
from threading import Thread

class FactorizeThread(Thread):
    def __init__(self, number):
        super().__init__()
        self.number = number

    def run(self):
        self.factors = list(factorize(self.number))

def factorize(number):
    for i in range(1, number+1):
        if number % i == 0:
            yield i

start = time.time()

numbers = [10000000,20000000]
for num in numbers:
    list(factorize(num))

end = time.time()

delta = end-start

print(f"non thread - 총 {delta:.3f}초 걸림")


start = time.time()

threads = []
for num in numbers:
    thread = FactorizeThread(num)
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()

end = time.time()

delta = end - start

print(f"thread - 총 {delta:.3f}초 걸림")

# non thread - 총 1.718초 걸림
# thread - 총 1.691초 걸림
```
위의 결과를 보면 스레드의 사용과 수행시간은 크게 차이접이 없어 보입니다. 하지만 **스레드 사용은 언제나 안 좋다?**라고 말할 수는 없습니다. **IO가 잦게 일어나는 태스크들**에서는 스레드는 큰 장점을 보일 수 있습니다.

**여러 작업을 스케줄링하며 CPU를 최대한 사용하려는 멀티 스레드가 한 번에 한 작업밖에 수행만 실행한다면, IO 작업시간동안 대기하는 작업을 실행시켜버리면 됩니다.** 스레드는 동일하게 한 번에 한 작업을 수행하지만, 블로킹 통신이 필요한 작업을 하면 비동기 작업처럼 다른 작업을 처리하며 IO가 끝날때까지 다른 작업을 수행 할 수 있습니다.

이건 확실한 성능적인 향상을 생각 할 수 있습니다.

```python
import select
import socket

def slow_systemcall():
    select.select([socket.socket()],[],[],0.1)

start = time.time()
for _ in range(5):
    slow_systemcall()
threads = []

end = time.time()
delta = end - start
print(f'non thread - 총 {delta:.3f}초 걸림')

start = time.time()
for _ in range(5):
    thread = Thread(target=slow_systemcall)
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()
    
end = time.time()
delta = end-start
print(f'thread - 총 {delta:.3f}초 걸림')

# non thread - 총 0.518초 걸림
# thread - 총 0.109초 걸림
```

위의 예제는 5개의 스레드를 이용한 작업을 비교 한 결과로 System call 중 소켓 IO로 구현 한 예제입니다. 이러한 IO작업은 멀티 스레드로 대략 스레드의 수만큼의 효과를 얻는 것을 볼 수 있습니다.

무조건적으로 멀티 프로세스가 아닌, 작업에 따라 좋은 방법을 찾아서 사용하면 좋을 것 같습니다.


### 스레드에서 데이터 경합을 피하기 위해 LOCK을 사용하라

파이썬의 GIL을 알고나면 **"어차피 한 작업만 실행된다면, 공유자원 접근에 걱정 할 필요가 없나?"**라고 생각 할 수 있습니다. 하지만 파이썬에서도 LOCK은 신경써야 하는 부분입니다.

GIL은 Referance Count의 안정성을 보장하기 위한 이유가 가장 큽니다. 다른 공유자원에 대해서는 무관심하기 때문에 언제든 데드락이 발생 할 수 있습니다. 오히려 자바와는 달리 원시 타입이 없기 때문에 더 자주 발생 할 수 있습니다.

그럼 우리가 LOCK을 사용해야 하는 이유가 명확해졌습니다.

책에 좋은 설명이 있어서 이 부분을 가져와서 예시를 한 번 들고 넘어가겠습니다.

```python
count += 1
# 위의 실행은

---

value = getattr(counter, 'count')
result = value + 1
setattr(counter, 'count', result)
# 이런 과정을 통해 동작합니다.
```

```python
# A thread
count += 1
# B thread
count += 1

---

value_a = getattr(counter, 'count')
# value_a = 0

# 컨텍스트 스위칭 A -> B

value_b = getattr(counter, 'count')
# value_b = 0
result_b = value_b + 1
setattr(counter, 'count', result_b)
# result_b = 1

# 컨텍스트 스위칭 B -> A

result_a = value_a + 1
setattr(counter, 'count', result_a)
# result_a = 1
```

별도의 변수로 적혀있지만, 두 동작 모두 count라는 하나의 변수에 접근하는 방식이기 때문에 해당 클래스의 count 속성 값은 결국 1이 됩니다.

#### 그럼 어떻게 LOCK을 거는가?

threading 라이브러리의 Lock을 사용하면 됩니다.

예제 코드를 남깁니다.

```python
# Lock을 사용하지 않는 Counter
class Counter:
    def __init__(self):
        self.count = 0
        
    def increment(self, offset):
        self.count += offset
from threading import Lock

# Lock을 사용하는 Counter
class LockingCounter:
    def __init__(self):
        self.lock = Lock()
        self.count = 0
    def increment(self, offset):
        with self.lock:
            self.count += offset

# Thread의 작동 주체 worker
def worker(sensor_index, how_many, counter):
    for _ in range(how_many):
        counter.increment(1)

```

```python

# Lock을 사용하지 않은 스레드 예제    
from threading import Thread

how_many = 10**6
counter = Counter()

start = time.time()
threads = []
for i in range(6):
    thread = Thread(target=worker, args=(i, how_many, counter))
    threads.append(thread)
    thread.start()
    
for thread in threads:
    thread.join()
    
expected = how_many * 6
found = counter.count
end = time.time()
delta = end-start

print(f'nonlock - 카운터 값은 {expected}이어야 하는데, 실제로는 {found}입니다.')
print(f'nonlock - 소요 된 시간은 {delta:.3f}초 입니다.')

# nonlock - 카운터 값은 6000000이어야 하는데, 실제로는 6000000입니다.
# nonlock - 소요 된 시간은 1.068초 입니다.

```

```python
# Lock을 사용하는 스레드 예제
lock_counter = LockingCounter()
lock_threads = []

start = time.time()

for i in range(6):
    thread = Thread(target=worker, args=(i, how_many, lock_counter))
    lock_threads.append(thread)
    thread.start()
    
for thread in lock_threads:
    thread.join()
    
expected = how_many * 6
found = lock_counter.count

end = time.time()
delta = end-start

print(f'lock - 카운터 값은 {expected}이어야 하는데, 실제로는 {found}입니다.')
print(f'lock - 소요 된 시간은 {delta:.3f}초 입니다.')

# lock - 카운터 값은 6000000이어야 하는데, 실제로는 6000000입니다.
# lock - 소요 된 시간은 2.322초 입니다.
```
둘 다 안정적인 결과가 나오네요?

일단.. 락을 사용 할 경우 시간이 더 소요되는 것을 볼 수 있습니다.

### Queue를 이용해서 순서대로 스레드를 동작시키는 파이프라인 구현

이 부분은 코드 한 개를 리뷰하는 것으로 정리 할 수 있을 것 같습니다.

```python
class ClosableQueue(Queue):
    SENTINEL = object()
    
    def close(self):
        self.put(self.SENTINEL)
        
    def __iter__(self):
        while True:
            item = self.get()
            try:
                if item is self.SENTINEL:
                    return
                yield item
            finally:
                self.task_done()
                
class StoppableWorker(Thread):
    def __init__(self, func, in_queue, out_queue):
        super().__init__()
        self.func = func
        self.in_queue = in_queue
        self.out_queue = out_queue
        
    def run(self):
        for item in self.in_queue:
            result = self.func(item)
            self.out_queue.put(result)
            
download_queue = ClosableQueue()
resize_queue = ClosableQueue()
upload_queue = ClosableQueue()
done_queue = ClosableQueue()

threads = [
    StoppableWorker(lambda x:x, download_queue, resize_queue),
    StoppableWorker(lambda x:x, resize_queue, upload_queue),
    StoppableWorker(lambda x:x, upload_queue, done_queue)
]

for thread in threads:
    thread.start()
    
for _ in range(1000):
    download_queue.put(object())
    
download_queue.close()
download_queue.join()
resize_queue.close()
resize_queue.join()
upload_queue.close()
upload_queue.join()
```

Closable Queue를 설명하면 **끝을 나타내는 값을 추가 할 수 있도록 재설정된 큐입니다.** 쉽게 구현되어있고, 직관적이기 때문에 짧게 덧붙이면 끝을 나타내는 값이 아니면 해당 값을 내보내고, 큐 대기를 멈춥니다.

**task_done에 대해서는 다시 한 번 공부해보겠습니다.**

StoppableWorker은 input을 iterator로 반복하면서, in_queue의 값은 한 개씩 추출되고 그 값을 out_queue에 저장하게 됩니다. 그리고 이 과정이 스레드로 돌아가는데, 위의 코드는 단일 스레드이기 때문에 성능상의 문제를 해결하지 않지만 전체적인 동작과정을 이해 할 수 있습니다.

각 작업은 독립적으로 작업합니다. 위 코드는 [ download >> resize >> upload >> done ]의 과정으로 설계 된 내용이기 때문에 모든 download 가 끝난 뒤 resize를 진행하고 resize가 모두 마무리 된 후 upload를 진행합니다. 그리고 결과를 done에 저장합니다.

### 요구에 따른 팬아웃을 진행하려면 새로운 스레드를 생성하지말라 / 동시성과 Queue를 사용하기 위해 코드를 어떻게 리팩터링 하는지 이해하라.

이 제목이 너무나도 어렵고 이해가 되지 않아서 제가 이해한 바로 표현하겠습니다.

**작업 마다의 스레드를 동적으로 생성하지말고, 일정 스레드를 생성 한 뒤 큐를 이용해서 작업 할 수 있도록 설계하라** 라고 생각합니다.

### 그냥 뛰어넘어서!!

이 책의 장점이자 단점은 가장 최적의 방법론을 가장 마지막에 말하는 점입니다.

### 스레드와 코루틴

이 부분을 짚고 넘어가고자 합니다.

스레드와 코루틴 모두 동시성을 보장하기 위해서 사용하는 기법이지만, 정확한 의미는 매우 다릅니다.

스레드는 각 코어를 기반으로 작업을 진행하는 방식인 반면에 코루틴은 작업 자체를 잘라서 동시에 수행하는 방식입니다. 즉 **스레드는 병렬적으로 작업을 수행**하지만, **코루틴은 한 스레드가 여러 작업을 나누어서 수행**합니다.

그래서 이 책에서는 병렬적 수행인 스레드에서 코루틴으로 수행하는 방식으로 개발하는 것을 매우 권장합니다.

물론 동작 자체가 시스템 콜을 호출하는 ( 정확히 말하면 IO 작업 등 ) 경우 일 경우입니다.

결국 IO 작업이나 특정 시스템 콜을 호출해서 커널에게 제어를 넘기고 대기하는 작업이 아니라면, 결국 GIL로 인해서 프로세스를 늘리는 방식이 유용합니다. 결국 이 장의 마지막에서 저자는 특정 동일한 작업 수행시 **ProcessPoolExcutor** 사용을 권장합니다. 물론 비동기 작업은 스레드 + 코루틴을 권장하구요





[파이썬 thread](https://velog.io/@cha-suyeon/%ED%8C%8C%EC%9D%B4%EC%8D%AC%EC%97%90%EC%84%9C-%EC%8A%A4%EB%A0%88%EB%93%9C%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%ED%92%80-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)



