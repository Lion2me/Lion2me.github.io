---

layout: post
title: Spark SQL & DataFrame
date: 2022-05-22 21:05:23 +0900
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
