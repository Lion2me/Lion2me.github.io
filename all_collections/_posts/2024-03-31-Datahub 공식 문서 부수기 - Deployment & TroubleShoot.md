---

layout: post
title: Datahub 공식 문서 부수기 - Deployment & TroubleShoot
date: 2024-03-30 18:05:23 +0900
category: DE
use_math: true
tags:
- 데이터 민주화
- 데이터 거버넌스
- 데이터 엔지니어
- 데이터 신뢰성
- Data Observability
- Data Reliability
- Datahub
- 데이터허브

---

이 글은 [Datahub의 공식 문서](https://datahubproject.io/docs/)를 공부하면서 얻은 지식을 "제가 이해하기 쉽게" 적어놓은 글입니다.

# Datahub

Datahub는 Acryl Data사와 Linked In사에서 함께 만든 데이터 디스커버리 오픈소스입니다. WEB 환경의 UI를 통해 다양한 플랫폼의 메타데이터를 종합적으로 조회 할 수 있도록 도와주는 서비스를 데이터 디스커버리 플랫폼이라고 말 할 수 있을 것 같습니다.

다양한 데이터 디스커버리 플랫폼이 있지만 Datahub은 REST API 또는 Ingestion 리소스를 통해 쉽게 메타데이터를 입력 할 수 있으며, 이러한 방식을 통해 정형화 된 메타데이터 주입과 자유로운 메타데이터 주입을 활용 할 수 있습니다. 뿐만 아니라 현재까지 다른 디스커버리 툴보다도 많은 데이터 플랫폼에 대한 플러그인을 갖추고 있기 때문에 Datahub이 현재의 데이터 디스커버리의 메인 툴로 자리잡고 있습니다.

DataHub를 사용하면 다양한 플랫폼에 분산되어있는 데이터에 대해 다음과 같은 이점을 얻을 수 있습니다.
- 데이터 셋의 오너십 관리
- 데이터 셋에 대한 이해
	- 사용 용어에 대한 설명
	- 스키마 내 컬럼 및 태그
- 데이터 셋의 계보
- 도메인 별 구분
- 검색을 이용한 데이터 셋 탐색
- plugin을 통한 데이터 신뢰성 검증

이 외에도 많은 이점을 얻을 수 있습니다만, 추후에 알게되면 추가하겠습니다.

# Datahub Deployment & TroubleShoot

이 내용은 [Datahub의 Deployment](https://datahubproject.io/docs/category/deployment-guides)을 기반으로  추가적으로 AWS 상에서 직접 구축하며 알게 된 내용을 포함하여 작성하였습니다.

Datahub의 구축은 기본적으로 Image를 이용하여 구축하는 방식에 최적화되어 있습니다. 따라서 docker & kubernetes를 이용하는 방식으로 쉽게 구축이 가능합니다.

Datahub Deployment의 포스트 내용으로는 helm을 이용하여 구축하는 방안에 대해 명령어로 쉽게 적어놓았기에 서비스를 띄우는 것 자체에 대해서는 큰 어려움이 없습니다. 하지만 구축 한 이후에 문제가 발생하면 내부의 동작을 이해하지 않으면 해결하기 어렵습니다.

## Deployment Status

Datahub 공식 문서에 따라 구축하면 다음과 같은 pod들이 떠있게 됩니다. 이 부분까지는 문제없이 수행됨을 가정하겠습니다.

```
NAME                                               READY   STATUS      RESTARTS   AGE
datahub-datahub-frontend-84c58df9f7-5bgwx          1/1     Running     0          4m2s
datahub-datahub-gms-58b676f77c-c6pfx               1/1     Running     0          4m2s
datahub-datahub-mae-consumer-7b98bf65d-tjbwx       1/1     Running     0          4m3s
datahub-datahub-mce-consumer-8c57d8587-vjv9m       1/1     Running     0          4m2s
datahub-elasticsearch-setup-job-8dz6b              0/1     Completed   0          4m50s
datahub-kafka-setup-job-6blcj                      0/1     Completed   0          4m40s
datahub-mysql-setup-job-b57kc                      0/1     Completed   0          4m7s
elasticsearch-master-0                             1/1     Running     0          97m
elasticsearch-master-1                             1/1     Running     0          97m
elasticsearch-master-2                             1/1     Running     0          97m
prerequisites-cp-schema-registry-cf79bfccf-kvjtv   2/2     Running     1          99m
prerequisites-kafka-0                              1/1     Running     2          97m
prerequisites-mysql-0                              1/1     Running     1          97m
prerequisites-neo4j-community-0                    1/1     Running     0          88m
prerequisites-zookeeper-0                          1/1     Running     0          97m
```

이 상황에서 IP를 타고 들어가면 정상적으로 Datahub 페이지에 접근 할 수 있지만, 우리는 **"어떤게 어떤 동작을 하는지 전혀 모르고"** 접근하고 있게 됩니다. 떠있는 각 Pod가 어떤 동작을 하는지 이해하면 앞으로의 TroubleShoot은 매우 쉽게 이해 할 수 있습니다.

지금부터 각 Pod의 동작에 대해 이해하는 시간을 가져보도록 하겠습니다.

### datahub-frontend

가장 먼저 알아 볼 Pod는 datahub-frontend입니다. 이 Pod는 우리가 접근하는 웹서버의 역할을 하고 있습니다.

우리가 datahub에 접근하면 가장 먼저 마주하는 인증(로그인) 과정도 frontend의 부분입니다. frontend는 기본적으로 아이디와 비밀번호를 생성하여 개인을 인증하는 방식을 사용 할 수 있지만 oauth를 사용하여 외부 서비스를 이용하여 인증을 할 수도 있습니다. 만약 다음에 인증에 문제점을 발견하면 이 부분도 고려하면 좋을 것 같습니다.

WebUI에서 요청하는 내용은 datahub-gms 를 통해서 datahub 내부 서비스에 반영됩니다. 즉, gms가 정상적으로 동작해야 frontend에서 보내는 요청에 대해서 정상적인 값을 받을 수 있습니다.

#### TroubleShoot Point

- WebUI에서 특정 요청을 했는데, 에러 로그 또는 반영이 되지 않는다.
	- gms Pod의 로그 및 datahub 데이터 서비스를 확인한다.

### datahub-gms & MCE/MAE-consumer

다음으로는 frontend에서 언급했던 [datahub-gms](https://datahubproject.io/docs/what/gms/) Pod에 대해서 알아보겠습니다.

gms는 기본적으로 대부분의 요청이 오고가는 Generalized Metadata Service 입니다. 그러면 gms를 공부하면 가장 먼저 알아 볼 내용은 gms에서 사용하고 있는 API들 임을 알 수 있습니다.

[datahub gms 공식 github](https://github.com/datahub-project/datahub/tree/master/metadata-service)에 이러한 API에 대한 예시가 잘 나와있습니다. 이 github repo에는 다음과 같은 형태의 API를 요청하는 것으로 Datahub 내부의 데이터를 관리한다는 점을 알 수 있습니다.

```
curl --location --request POST 'http://localhost:8080/aspects?action=ingestProposal' \
--header 'X-RestLi-Protocol-Version: 2.0.0' \
--header 'Content-Type: application/json' \
--data-raw '{
  "proposal" : {
    "entityType": "dataset",
    "entityUrn" : "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
    "changeType" : "UPSERT",
    "aspectName" : "datasetUsageStatistics",
    "aspect" : {
      "value" : "{ \"timestampMillis\":1629840771000,\"uniqueUserCount\" : 10, \"totalSqlQueries\": 20, \"fieldCounts\": [ {\"fieldPath\": \"col1\", \"count\": 20}, {\"fieldPath\" : \"col2\", \"count\": 5} ]}",
      "contentType": "application/json"
    }
  }
}'
```

요청을 보면 entity에 대한 정보와 aspect라는 형태로 내부의 데이터를 포함 한 것을 알 수 있습니다. 너무 자세히 알아보는 것은 다음으로 미루고 이 요청에 대한 형태만 간략히 기억합시다. 이 내용은 추후 mysql과 elasticsearch(or neo4j)를 이해하는 것에 도움이 됩니다.

특정 목적으로 인해 API를 활용 할 수 있습니다. 이 경우 API에 대한 문서를 정독하여 직접 요청하는 방법을 사용 할 수 있지만, Datahub로 구축한 페이지에서 (Admin의 경우) 쉽게 API를 요청 할 수 있는 페이지로 접근하여 사용 할 수 있습니다.

지금까지 frontend에서 특정 요청을 gms를 통해 데이터를 관리한다는 것을 알게 되었습니다. 그러면 gms로 요청 된 데이터는 어떻게 흘러갈까요?

Datahub의 공식 문서에 이러한 궁금증을 해소 할 수 있는 [아키텍처(GMA)를 시각화 한 페이지](https://github.com/linkedin/datahub-gma/blob/master/docs/architecture/architecture.md)가 있습니다. 이 페이지를 보면 각 요청에 대한 변경사항은 [MCE](https://datahubproject.io/docs/what/mxe/#metadata-change-event-mce) 개념과 [MAE](https://datahubproject.io/docs/what/mxe/#metadata-audit-event-mae)개념이 사용됨을 알 수 있습니다.  그러면 MCE와 MAE를 알아보지 않을 수 없습니다.

#### MCE(Metadata Change Event)

[공식문서에서의 MCE](https://datahubproject.io/docs/what/mxe/#metadata-change-event-mce)를 설명하는 단어는 "제안"입니다. MCE는 메타데이터의 변경사항에 대해서 이벤트로 만든 메시지입니다.

특징으로는 **오직 한 Entity에 대해서 여러 변경 된 Aspect를 가지고 있는 메시지**라는 점 입니다. 그래서 요청메시지를 보면 URN이 한 개 만 있다는 것을 알 수 있습니다.

```
{
  "proposedSnapshot": {
    "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
      "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
      "aspects": [
        {
          "com.linkedin.pegasus2avro.common.Ownership": {
            "owners": [
              {
                "owner": "urn:li:corpuser:jdoe",
                "type": "DATAOWNER",
                "source": null
              },
              {
                "owner": "urn:li:corpuser:datahub",
                "type": "DATAOWNER",
                "source": null
              }
            ],
            "lastModified": {
              "time": 1581407189000,
              "actor": "urn:li:corpuser:jdoe",
              "impersonator": null
            }
          }
        }
      ]
    }
  }
}
```
위 MCE는 오직 하나의 "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)"에 대한 aspect들의 변경을 포함하고 있습니다.

#### MAE(Metadata Audit Event)

[공식문서에서의 MAE](https://datahubproject.io/docs/what/mxe/#metadata-audit-event-mae)를 보면 실제로 우리가 조회 할 수 있는 데이터로 저장하기위한 최종 메시지임을 알 수 있습니다. MAE도 MCE와 마찬가지로 하나의 URN에 대한 변경사항을 가지고 있으며, 이 경우에는 조금 다르게 기존의 데이터에 대한 정보도 포함되어 있는 것을 볼 수 있습니다.

```
{
  "oldSnapshot": {
    "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
      "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
      "aspects": [
        {
          "com.linkedin.pegasus2avro.common.Ownership": {
            "owners": [
              {
                "owner": "urn:li:corpuser:jdoe",
                "type": "DATAOWNER",
                "source": null
              },
              {
                "owner": "urn:li:corpuser:datahub",
                "type": "DATAOWNER",
                "source": null
              }
            ],
            "lastModified": {
              "time": 1581407189000,
              "actor": "urn:li:corpuser:jdoe",
              "impersonator": null
            }
          }
        }
      ]
    }
  },
  "newSnapshot": {
    "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
      "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)",
      "aspects": [
        {
          "com.linkedin.pegasus2avro.common.Ownership": {
            "owners": [
              {
                "owner": "urn:li:corpuser:datahub",
                "type": "DATAOWNER",
                "source": null
              }
            ],
            "lastModified": {
              "time": 1581407189000,
              "actor": "urn:li:corpuser:jdoe",
              "impersonator": null
            }
          }
        }
      ]
    }
  }
}
```

위의 MAE 예시 요청 데이터를 보면 old/new snapshot이라는 용어를 쓴 것을 볼 수 있습니다. 이러한 용어를 쓰는 이유는 바로 "**MAE를 변경하는 방법이 스냅샷을 덮어쓰는 방식**"이기 때문입니다.

가끔 elasticsearch를 작업하다보면 최근에 변경한 데이터가 반영되지 않는 문제가 있을 수 있습니다. 이 경우에는 MAE가 ElasticSearch에 반영되지 않은 경우라고 생각 할 수 있습니다. Datahub에서도 이러한 문제가 발생 할 수 있다는 것을 인지하고 있기 때문에, 가장 먼저 MAE가 만들어졌는지 확인하기 위해 **MySQL에서 해당 Aspect가 잘 저장되었는지를 확인**해보신 후 Datahub의 **Job중에서 Restore Job**이 있습니다. 이 Job을 생성하여 실행해주면 Sync를 맞추어 주게 됩니다.

#### 정리

그러면 모든 동작에 대해서 아키텍처를 따라 설명해보겠습니다.

1. 메타데이터에 대한 변경사항은 MCE의 요청 형태로 만들어져서 Kafka에 Publishing됩니다.
2. 해당 메시지를 MCE Consumer Job이 가져와서 요청 된 MCE가 정상적으로 반영되어도 되는지를 확인합니다.
3. MCE Consumer Job은 해당 MCE를 Metadata Store에 전달합니다.
4. Metadata Store는 적합하다고 판단 된 MCE를 기반으로 MAE로 만들어서 Kafka에 전달합니다.
5. 이 MAE를 MAE Consumer Job이 가져와서 elasticsearch 혹은 neo4j와 같은 데이터플랫폼에 적재합니다.
6. 이후 frontend에서 요청하는 정보를 elasticsearch 혹은 neo4j에서 조회하여 사용자에게 노출합니다.

#### TroubleShoot Point

- 메타데이터의 변경을 요청했는데 WebUI에서 노출되지 않는다.
	- MCE가 잘 전송되었나?
		- Kafka topic MetadataChangeEvent_v4 의 최근 메시지를 확인해본다.
	- MAE가 잘 전송되었나?
		- 반영되지 않아야 하는 MCE였나?
			- MCE Consumer Job에 대한 로그 및 데이터를 확인한다.
		- 반영되어야 하는 MCE인데 반영되지 않은건가?
			- MySQL(Metadata Store에서 바로 입력되는)에 해당 Aspect가 있는지 확인한다.
			- MAE Consumer Job에 대한 로그 및 데이터를 확인한다.
		- 만약 elasticsearch 혹은 neo4j를 변경하면서 데이터가 사라졌다?
			- https://datahubproject.io/docs/how/restore-indices 링크에 있는 별도 job으로 구성되는 Restore job 실행

### Kafka/ElasticSearch/Mysql setup

각 데이터 플랫폼에 대한 setup Job들은 Datahub을 사용 할 수 있는 형태로 데이터플랫폼에 적절한 DDL등을 실행시킵니다. Elasticsearch의 경우에는 인덱스에 관련한 설정을 미리 실행하고 MySQL등은 적절한 스키마 및 테이블을 생성합니다.

### prerequisites ~

prerequisites가 prefix로 붙은 Pod들은 모두 내부적으로 데이터플랫폼을 구성하는 것입니다. 만약 구축 시 외부의 데이터베이스를 사용한다면 helm 폴더내에 있는 prerequisites의 value.yaml에서 해당 플랫폼을 disabled 시키면 해당 플랫폼을 띄우지 않습니다.

장단점이 있지만, Pod로 운영되는 경우 적어도 MySQL의 저장공간은 영구 공간으로 보관하는 것이 안전합니다. 최악의 경우 ElasticSearch에 문제가 발생하더라도 MySQL에 적재 된 Aspects만으로 restore 할 수 있기 때문입니다.

#### TroubleShoot Point

- (datahub 폴더 내의)value.yaml를 수정하여 외부 데이터플랫폼(elasticsearch, mysql 등)으로 연결했는데 해당 플랫폼이 Pod로 뜨는 경우
	- prerequisites의 value.yaml 내부에 unused(disabled)를 표시해주어야 한다.
		- 뜨더라도 log를 확인해서 해당 플랫폼이 동작하지 않으면 큰 문제는 없을 듯
- MySQL에 있는 Aspects는 언제든 restore Job으로 입력 할 수 있으나 오래 걸리기 때문에 조심하여 사용


