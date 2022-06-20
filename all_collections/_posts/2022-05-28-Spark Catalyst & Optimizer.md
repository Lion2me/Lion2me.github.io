---

layout: post
title: Spark SQL & DataFrame
date: 2022-05-28 21:05:23 +0900
category: Spark
use_math: true

---

# Spark Catalyst & Optimizer

## Catalyst

Catalyst는 Logical Plan을 Physical Plan으로 변경해주는 작업을 수행합니다. 



### 1. Logical Plan

우리가 어떤 작업을 수행 할 때 작업이 어떻게 수행 할 지 동작 과정을 명확하게 적지 않습니다. 하지만 동작을 수행 할 때는 명확하게 정의 되어 있어야 하죠.

예를 들어 A 데이터를 B를 기준으로 필터링하고 C를 기준으로 그룹핑하는 명령을 날리면 우리는 이 정도의 SQL 문을 날릴 것 같습니다.

```python
df.select(f'select * from A where B < {num} group by C')
```

하지만 이 작업이 Spark RDD 입장에서 어떻게 동작하는지를 명시하지 않습니다. 이런 **수행해야하는 Transformation 단계의 추상화**가 Logical Plan입니다. 데이터가 어떻게 변화되어야 하는지를 명시하지만 실제 동작은 알 수 없습니다.

### 2. Physical Plan

Logical Plan이 클러스터 위에서 어떻게 동작 할 것인지에 대한 정보가 쓰여진 실제 동작 방식입니다. 

## Catalyst가 하는 일

Catalyst가 하는 일은 결국 Logical Plan을 Physical Plan으로 변경하는 일을 입니다. 하지만, **어떻게 바꾸는지**가 중요 할 것 같습니다.

그 과정은 다음의 순서로 진행됩니다.

1. 분석 : DataFrame의 관계를 계산하고, 컬럼의 타입과 이름을 확인합니다.
2. 상수로 표현 된 표현식을 컴파일 타임에 계산( Constant Folding )합니다.
3. Predicate pushdown을 수행합니다. ( 아래에서 자세하게 )
4. Projection pruning을 수행합니다. ( 아래에서 자세하게 )
5. Physical Plan 만들기

[Spark의 기법에 대한 좋은 블로그](https://medium.com/@leeyh0216/spark-sql-6dc3d645cc31)

### Constant Folding ( 상수 표현식 )

상수 표현식은 변수의 연산을 런타임에 계산하지 않고 컴파일 타임에 계산하는 방식입니다.

예를 들면

```python
i = 300 * 200 + 15
```
와 같은 연산이 있을 때 원래라면 런타임 중 해당 연산을 수행해야 하지만, Constant Folding은 이 연산을 컴파일을 하는 과정에서 수행합니다.

```python
i = 60015
```

이러한 방식의 컴파일러 최적화는 성능적인 부분에서 좋은 효과를 보인다고 합니다.

### Predicate pushdown 

predicate pushdown은 where 절을 외부에서 내부로 가져오는 방법이라고 생각 할 수 있습니다. 이 부분은 Spark에 대한 공부를 할 떄 중요하게 다루는 **네트워크 통신을 최적화 하자!** 와 비슷한 맥락이라고 할 수 있습니다.

우리는 **groupByKey와 reduceByKey**의 차이에 대해서 알고 있고, 가능한 reduceByKey를 사용해야 함을 알고 있습니다. 그리고 그 이유는 바로 필터링의 타이밍인 것 또한 알고 있습니다.

RDD를 직접 다루는 것이 아니기 때문에 우리는 SQL문을 통해 분산되어있는 노드를 불러 올 떄 어떻게 최적으로 데이터를 가져오는지 정할 수 없습니다.

그래서 Spark는 자체적으로 조인을 하기 전 필터링을 해주는 방식으로 동작을 최적화 합니다. 이게 Predicate pushdown입니다.

### Projection Pruning

Projection Pruning은 연산에 필요한 컬럼만을 가져오는 기법입니다. 일반적으로 어떤 쿼리를 날릴 때 사용하는 컬럼은 크게 많지 않습니다. 아마 migration 작업이 아니라면 그럴 것이라 생각됩니다.

이 경우 데이터를 가져 올 때부터 필요한 컬럼만을 가져온다면 더욱 좋은 성능을 낼 수 있을 것이라는게 Projection Pruning입니다.

Projection Pruning은 사용하는 컬럼만을 가져오는 방식을 통해 문제를 더욱 효과적으로 풀 수 있습니다.





