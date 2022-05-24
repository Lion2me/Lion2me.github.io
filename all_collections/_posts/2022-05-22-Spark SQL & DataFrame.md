---

layout: post
title: Spark SQL & DataFrame
date: 2022-05-22 21:05:23 +0900
category: Spark
use_math: true

---

# Spark SQL & DataFrame


## Spark SQL

Spark SQL은 구조화 된 데이터를 DataFrame 기반으로 쉽게 조회 할 수 있는 방법입니다. DataFrame 기반으로 구현 된 구조화 데이터의 경우 우리가 일반적으로 사용하는 RDB의 쿼리문과 유사하게 찾을 수 있습니다.

하지만 일반적인 데이터베이스는 인덱스를 찾아 최적의 필터링을 마친 뒤 행을 탐색하는 것이라면 Spark SQL은 RDD의 동작방식을 사용합니다.

쿼리문의 경우 대체적으로 RDB와 동일하기 때문에 별도로 적지 않겠습니다.

## Spark DataFrame

구조화 된 데이터를 다루기 쉽게 Pandas의 DataFrame과 비슷하게 만드는 방식입니다. 구조화 된 데이터란 **데이터베이스**와 같이 스키마가 존재하는 데이터를 말하지만, 조금 더 나아가 **반정규화 데이터 ( csv, json, parquet, ...)도 가능합니다.**

이전까지는 Spark는 RDD를 기반으로 동작한다고 했지만, DataFrame이라는 새로운 방법이 등장해서 당황했었습니다. 하지만 실제로 수행하는 동작은 RDD로 동작하며, 그저 명시적으로 데이터를 구분하기 위해 DataFrame 형태로 만든다고 생각하면 될 것 같습니다.

Spark SQL이 DataFrame 형태의 데이터를 쿼리로 쉽게 사용 할 수 있다고 했지만, DataFrame 자체에 동작을 수행 할 수 있는 명령어들이 있습니다. 대표적으로 스키마를 확인 할 수 있는 printSchema(), 데이터를 상위 20개 열을 확인하는 show(), 조회 할 수 있는 select(), 집계함수 agg() 등이 있습니다.

뿐만아니라 데이터를 저장할 때 Array, Map, Struct 타입으로 저장도 가능합니다. 대부분의 SQL과 비슷한 작업이 가능하다고 합니다.

SQL과 비슷한 작업은 Join, Groupby 등을 말합니다.

## Spark DataFrame을 이용해서 데이터 사용

Spark DataFrame은 실제로 데이터를 메모리에 적재하지 않습니다. 실제로 DataFrame을 이용해서 csv 파일의 데이터를 불러올 때 사용하는 read.csv() 함수를 보면 다음과 같습니다.

```
trip_data = spark.read.csv(f"{directory}/{trip_file}", inferSchema = True, header = True)
zone_data = spark.read.csv(f"{directory}/{zone_file}", inferSchema = True, header = True)
```

그리고 trip_data를 보면 다음과 같은 객체가 나옵니다.

```python
print(trip_data)
# DataFrame[hvfhs_license_num: string, dispatching_base_num: string, pickup_datetime: string, dropoff_datetime: string, PULocationID: int, DOLocationID: int, SR_Flag: int]
```

언뜻봐도 DataFrame의 스키마에 해당하는 값을 보여줌을 알 수 있습니다. 또한 내부적으로 .RDD()라는 메서드를 가지고 있습니다.

```python
print(trip_data.rdd)
# MapPartitionsRDD[46] at javaToPython at NativeMethodAccessorImpl.java:0
```

javaToPython을 보면 JVM을 사용하고 있음을 알 수 있습니다. JVM을 사용하는 이유는 아래에 좋은 포스팅을 찾아 놓았습니다.

[Spark 메모리 최적화에 관련한 포스트](https://velog.io/@busybean3/Apache-Spark-%EC%95%84%ED%8C%8C%EC%B9%98-%EC%8A%A4%ED%8C%8C%ED%81%AC%EC%9D%98-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EA%B4%80%EB%A6%AC%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C)

Spark DataFrame을 선언하는 것은 확실한 RDD임을 알 수 있습니다. 즉 실제 데이터는 올라오지 않습니다. 그 후 우리는 SQL문을 사용하기 위해 다음과 같이 TempView라는 객체를 만듭니다.

```python
trip_data.createOrReplaceTempView("trip_data")

spark.sql("select * from trip_data limit 5").show()
```

알아 본 결과 createOrReplaceTempView를 사용해서 임시 뷰를 만들어도 그 데이터는 메모리 적재되지 않습니다.

TempView를 만드는 것은 Global과 local이 있습니다. Global로 만들지 않으면 세션이 끊기면 해제되지만 Global로 만들면 Spark Context가 끝날 때 해제 됩니다.