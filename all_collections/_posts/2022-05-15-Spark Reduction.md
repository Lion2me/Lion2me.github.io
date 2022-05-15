---

layout: post
title: Spark Reduction
date: 2022-04-04 21:05:23 +0900
category: Spark
use_math: true

---

# Spark 연산


## Spark Reduction

Reduction은 요소들을 모아서 하나로 합치는 작업입니다.

예시를 들면 1 + 1 = 2를 수행하면서 1 요소 2개를 2라는 값으로 합쳤습니다. Spark는 기본적으로 RDD 단위로 수행 값을 저장하기 때문에 1 요소 2개는 사라질 것 입니다.
대부분의 Action은 Reduction이지만, 파일 입출력이나, 영속화 관련 Action은 예외입니다.

가장 대표적인 Reduction 함수는 다음과 같습니다.

1. Reduce
2. Fold
3. GroupBy
4. Aggregate

### 파티션 갯수에 따른 결과가 다른 문제

연산을 수행 할 때 연산을 묶는 기준인 파티션의 갯수에 따라 원하는 결과가 나오지 않을 수 있습니다.

예를 들면 다음의 식을 사용해보겠습니다.

**lambda x,y : (x\*2) + y**

그리고 [ 1, 2, 3, 4 ] 값이 입력 되었을 때
(1,2,3,4) 로 묶을 것 인지 (1,2),(3,4) 로 묶을 것인지에 따라서 연산의 결과가 달라지게 됩니다.

첫 번째 경우 연산 순서 : ( 1 \* 2 + 2 ) -> ( 4 \* 2 + 3 ) -> ( 11 \* 2 + 4 ) = 26

두 번째 경우 연산 순서 : ( 1 \* 2 + 2 ) \* 2 + ( 3 \* 2 + 4 ) = 18

파티션의 갯수는 연산의 크기나 혹은 컴퓨팅 사양에 따라 변경 될 수 있기 때문에 파티션의 갯수를 고정하는 것은 좋은 방법이 아닙니다. 그래서 프로그래머가 교환 법칙과 결합 법칙을 잘 생각하면서 연산을 구분해줘야 합니다.

### Reduce는 각 요소를 순환하면서 각 순서에 맞게 수행하는 연산

### Fold는 Reduce에 Zero Value가 들어가는 연산

Fold의 경우에는 주의 할 점이 있기 때문에 추가적으로 적습니다.

Fold에서 설정하는 기본 값은 **파티션 단위로 적용 됩니다.** 그러므로 덧셈의 경우 각 요소의 값을 더하는 연산을 사용 할 때 파티션의 갯수에 따라 문제가 발생 할 수 있습니다.

### GroupBy는 기준 함수를 이용하여 결과 값 기준으로 묶는 함수

GroupBy는 기준 함수를 이용해서 결과 값에 따라서 RDD의 값들을 묶어주는 함수입니다.

**묶이는 방식은 튜플 형태로 ( 기준 값, [ 결과들 ]** 이라고 생각하면 됩니다. Spark에서 사용하는 (Key, Values) 형태 입니다.

### Aggregate는 초기값과 map 함수 reduce 함수를 별도 정의

어떻게 요소를 mapping하고 reduce 할 지 직접 정합니다. 일반적으로 입력과 출력의 타입이 다르거나 유연하게 적용 할 때 자주 사용 되는 듯 합니다.


## Spark Key - Value RDD Operation & Joins

### GroupByKey

GroupByKey는 Action 이였던 GroupBy를 기준으로 값들을 묶어주는 Transformation입니다. 

### ReduceByKey

GroupByKey + Reduction 을 수행하는 Transformation입니다.

일반적으로 GroupByKey보다 빠른 연산을 수행하는데, 그 이유는 네트워크를 통해 값을 가져오기 전에 해당 Worker 내에서 값들을 묶어주기 때문입니다.

네트워크 통신을 최소화 하고, 그 값을 전달받지 않기 때문에 훨씬 좋습니다. 듣기로는 GroupByKey를 잘못 사용 할 경우 아직 제대로 필터링 되지 않은 수많은 데이터를 메모리로 올리려는 동작에 의해 OutOfMemory가 발생한다고 합니다.

### mapValues

mapValues는 Value에만 함수를 적용시키는 Transformation으로 파티션과 키에는 별도의 작업을 하지 않기 때문에 좋은 성능을 보입니다.

정확한 실행 순서는 아직 모르겠지만, 네트워크 통신을 하기 전에 데이터를 mapping하기 때문에 별도의 오버헤드가 없는 것 같습니다.

### CountByKey

각 키에 대해서 요소의 갯수를 세는 Action 함수 입니다.

### keys

모든 key를 가진 RDD를 생성합니다. 이 결과 값은 Unique하지 않고 모든 데이터에 대해서 key를 가져오기 때문에 조심해야합니다.

### Join

RDB의 Join과 동일하다고 생각 할 수 있습니다.

## Spark Suffling & Partitioning

### Shuffling

shuffling은 여러 노드에서 서로 데이터를 주고 받는 과정에서 발생합니다.

네트워크 통신을 기반으로 동작하기 때문에 성능적으로 많은 불이익을 가져오고 우리는 Shuffling을 줄이는 방향으로 개발을 해야 합니다.

예를 들면 GroupByKey를 사용해서 Transformation을 할 경우 각 노드에서 서로 (Key, Value)를 통신하면서 묶게 됩니다. 이 과정에서 심각한 성능 불이익이 발생합니다. 그래서 ReduceByKey를 사용하는 것이 좋습니다.

ReduceByKey는 각 노드에서 자체적으로 Reduce를 통해 값을 통합 한 뒤 Shuffling을 수행하기 때문에 더욱 효과적입니다.

### Partition

파티션의 목적은 **데이터를 최대한 균일하게 퍼트리고, 쿼리가 같이 되는 데이터를 같이 두어 검색 성능을 향상**하는데 있습니다.

강의에 중요한 Partition의 특징이 있어 정리합니다.

1. RDD는 쪼개져서 여러 Partition에 저장됩니다.
2. 하나의 Partition은 하나의 Node에 저장됩니다.
3. 하나의 Node는 여러개의 Partition을 가질 수 있습니다.
4. Partition의 크기와 배치는 자유롭게 지정 할 수 있으며, 성능에 큰 영향을 미칩니다.
5. Key-Value RDD를 사용 할 경우에만 의미가 있습니다.
6. Spark의 Partition == Data Structure 라고 생각하면 됩니다.

#### Hash Partitioning

해시 함수를 통한 키를 기반으로 Partitioning 하는 방식

#### Range Partitioning

특정 기간이나 날짜 등 범위 별로 Partitioning 하는 방식

#### Partition 하기

디스크에서 Partitioning을 하는 방법은 PartitionBy를 사용 하면 됩니다.

#### Partition이 생성되는 작업을 잘 구분하자

transformation과 action을 수행하면서 partition이 생성되는 작업들이 있습니다. 모든 명령을 올리기 힘드니 차차 공부하면서 알아볼 예정입니다.