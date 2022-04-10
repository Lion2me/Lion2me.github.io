---

layout: post
title: Spark Topology
date: 2022-04-04 21:05:23 +0900
category: Spark
use_math: true

---

# Spark의 동작 방식
이번 포스팅에서는 Spark가 어떻게 동작하는지 마구 적어보겠습니다.

Spark는 Master Worker Topology로 구성되어 있습니다. 기본적으로 항상 데이터가 여러 곳에 분산 되어 있는 상태이며, 같은 연산도 여러 노드를 걸쳐서 실행되게 되는 점을 고려해야합니다.

과정은 다음의 그림을 보면 알 수 있습니다

Spark 실행 그림

Spark의 Master Node에 해당하는 부분이 바로 Driver Program입니다. 그리고 Slave Node에 해당하는 부분이 Worker Node라고 할 수 있습니다.

Driver Program은 **Spark Context를 단 한 개를 가지고 있는데, Spark Context는 RDD를 만드는 작업을 수행합니다.** 

텍스트 데이터를 불러오는 Textfile이나 Serialize는 Driver Program의 SparkContext 에서 실행됩니다. Driver Program은 개발자와 프로그램이 상호 작용을 할 수 있는 공간이고, 실제로 분산 환경에서 동작하는 것은 Worker입니다.

예제에서는 데이터를 print하는 액션을 취하는 부분이 있었는데, 여기서 결과로는 보이지 않는 문제가 발생했습니다. 이 이유는 바로 Action을 처리하는 노드가 Worker 노드이기 때문에 Driver Program에 해당하는 로컬환경에서는 해당 명령이 실행되지 않기 때문입니다.

Driver Program과 Worker Node가 소통하는 방법으로는 중간에 Cluster Manager라는 단계를 두고 소통합니다.

수행되는 작업의 스케줄링과 자원관리를 도와준다.

Driver Program은 모든 프로세스 조직하고, 메인 프로세스를 실행, SC생성, RDD생성, Transformation, Action 저장, Worker에 전송

Worker Node의 Excuter는 연산 수행, 데이터 저장, DP에 전송, Task 실행 후 연산 결과 DP에 전송, 연산 결과를 저장하기위한 캐시도 있음 

DP -> sc 생성(spark application) -> 클러스터 매니저에 연결 -> 자원 할당 -> 클러스터에 있는 노드들의 익스큐터 수집 -> 연산 수행 후 데이터 저장 -> sc가 익스큐터에게 task 전송 -> task 연산 결과를 다시 드라이버에게 전달

위의 내용을 깊게 알아보자

