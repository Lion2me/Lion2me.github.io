---

layout: post
title: Datahub 공식 문서 부수기 - Concepts
date: 2024-03-08 18:05:23 +0900
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

# Metadata Model

[Datahub의 Concept 문서](https://datahubproject.io/docs/what-is-datahub/datahub-concepts/)에서는 General Concepts가 먼저 소개되지만 저는 Metadata Model을 먼저 알면 이해하기 쉬울 것 같아 순서를 바꿔서 Metadata Model을 먼저 설명하겠습니다.

Metadata Model은 Datahub에서 활용되는 다양한 객체에 대해서 어떻게 분류되는지를 말합니다. 크게 3가지로 구분됩니다.

1. Entity
2. Aspect
3. Relationships

위 세 가지의 Model을 이해하기 위해서는 Datahub이 그래프 데이터베이스로 표현되어진다는 정보를 알면 좋을 것 같습니다. 그래프 데이터베이스에 대한 내용은 추후에 별도로 포스트를 적고 싶은 내용이지만, 간략히 설명하면 다음의 3가지의 속성을 가지는 데이터베이스입니다.

1. Nodes
	- 특정한 하나의 객체를 말합니다.
	- 각 node는 0개 이상의 Label을 가지고 있습니다.
2. Properties
	- 노드 내의 속성을 말합니다.
	- 예를들면, 축구선수(Label)을 가진 손흥민이라는 이름(Property)을 가진 Node가 있을 수 있습니다.
3. Relationships
	- 두 Node 사이의 관계를 말합니다.
	- 예를들면, 토트넘(Node)에 속한(Relationships) 손흥민(Node)이 있을 수 있습니다.

이 내용을 그대로 Metadata Model에 입히면 이해하기 쉽습니다.

1. [Entity (Node)](https://datahubproject.io/docs/metadata-modeling/metadata-model)
	- Datahub에서 사용하는 하나의 객체를 말합니다.
	- Dataset, Glossary Term, Tag 등 Datahub에서 URN을 가지고 표현되는 것들이 하나의 Entity라고 말할 수 있습니다.
2. [Aspect (Properties)](https://datahubproject.io/docs/what/aspect)
	- Datahub의 특정 Entity 내에서 활용되는 속성값을 말합니다.
	- Lion2me 유저(Entity)가 Admin Role(Entity)을 속성(Aspect)으로 가지고 있다고 말할 수 있습니다.
	- 주의 할 점은 속성으로 사용되는 것은 Entity 일 수 있으며 Aspect는 해당 Entity의 URN을 속성 값으로 가진다고 볼 수 있습니다.
3. [Relationships](https://datahubproject.io/docs/what/relationship)
	- Datahub에 두 노드 간의 관계를 말합니다.
	- Lion2me 유저(Entity)가 Admin Role(Entity)을 속성(Aspect)으로 가지고 있다(Relationships)고 말할 수 있습니다.


# General Concepts

DataHub를 이해하려면 내부적으로 어떤 방식으로 동작하는지 이해해야 합니다. 그러한 이해를 높이기 위해 [Datahub의 Concept](https://datahubproject.io/docs/what-is-datahub/datahub-concepts/) 페이지를 이해하는 시간을 갖도록 하겠습니다.

DataHub의 내부적으로 동작하는 특정 개념에 대한 이해로 나아가기 위해서는 [PDL Schema](https://linkedin.github.io/rest.li/pdl_schema)에 대해 간략하게 알고 나가면 좋을 것 같습니다. 크게 복잡한 내용은 아니고, 내부적으로 DataHub이 특정한 개체나 속성을 표현하는 방식으로 PDL 스키마를 활용한다는 정도만 알아도 좋을 것 같습니다.

그리고 이 내용에 더 나아가 DataHub에서 특정 개념을 연결하는 방식으로 neo4j, 즉 그래프 데이터베이스를 활용한다는 점을 추가적으로 이해하면 이후의 DataHub의 동작을 더 쉽게 이해 할 수 있습니다.

## URN (Uniform Resource Name)

[URN](https://datahubproject.io/docs/what/urn/#namespace)은 Datahub 내부적으로 특정 리소스를 특정 할 수 있는 ID값입니다.

```
urn:<Namespace>:<Entity Type>:<ID>
```

일반적으로 위의 형식에 따라 각 리소스마다 개별적으로 제공됩니다. URN은 DataHub에 저장되는 거의 모든 리소스에 대해서 생성됩니다. 예를들면, 실제로 메타데이터를 담고있는 Dataset과 용어를 설명하는 glossaryTerm 등이 있습니다.

이렇게 URN을 통해 개별 리소스를 다루면 REST API를 통해 리소스에 대한 접근이 용이해지고 구분 또한 편리해집니다.

### Namespace

Namespace는 공식문서에 따르면 기본적으로 "li"라는 값을 가지고 있지만, 조직에 따라 fork 후 자유롭게 변경 할 수 있다고 합니다. 실제로 DataHub Github을 들어가서 각 개체에 대한 코드를 확인하면 다음과 같은 내용을 확인 할 수 있습니다.

```
namespace com.linkedin.entity

import com.linkedin.metadata.snapshot.Snapshot

record Entity {
    value: Snapshot
}
```

실제로 저 namespace가 urn에 반영되는 값은 아니지만 li가 linkedin을 의미함을 알 수 있고, 조직에 따라 커스텀으로 변경 할 수 있음도 예상 할 수 있습니다.

### Entity Type

Entity Type은 간략하게 말하면 **"어떤 리소스인지"**를 나타내는 값이라고 볼 수 있습니다. 위에서 예시로 사용 한 Dataset과 glossaryTerm 등이 이에 속합니다.

Entity는 추후에 Datahub model metadata에 대해서 자세하게 적도록 하겠습니다만, DataHub 공식 문서에서는 Datahub에서 Entity에 대한 변화를 반영할 때 사용되는 [GMA 아키텍처](https://github.com/linkedin/datahub-gma/blob/master/docs/architecture/architecture.md)의 Entity 값과는 다를 수 있음을 말하고 있습니다. GMA Context에서 DatasetUrn라는 Entity 값을 사용하더라도, 실제 반영되는 값은 "dataset" Entity Type을 가지듯 차이가 있으므로, URN 사용 시 유의해야 할 것 같습니다.


### ID

ID는 리소스마다의 고유 식별자로 기본 값으로 UUID를 사용하고 있습니다. 하지만 ID 값은 원하는 값으로 지정 할 수 있으며 다중 필드를 하나의 ID로 설정 할 수 있습니다. 뿐만아니라 다른 URN 값을 포함하여 사용 할 수도 있습니다.

비 URN값으로 String, Integer, PDL의 ENUM 값으로 설정 할 수 있습니다.

## Policy

Datahub에서 [Policy](https://datahubproject.io/docs/authorization/policies#introduction)는 특정 리소스에 접근 할 수 있는 정책을 말합니다.

DataHub에서는 상당히 세부적인 접근 제어를 수행 할 수 있습니다. 큰 범위로 표현하는 다음의 두 방식이 있습니다.

### Platform Policies

Platform Policies는 말 그대로 플랫폼 내에서의 접근 제어를 말합니다.

예를 들면

- 특정 유저(혹은 그룹)가 플랫폼 내 특정 페이지(서비스)에 접근 할 수 있는지를 결정하는 정책
- 유저 및 그룹을 생성, 관리 할 수 있는 정책
- 내부의 정책을 관리 할 수 있는 정책

등이 있습니다. 자세한 정책에 대한 내용은 공식 문서에 더욱 자세하게 나와있습니다.

이러한 정책을 설정하기 위해 필요 한 파라미터는 다음과 같습니다.

- Actors : 어떤 유저(혹은 그룹)가 정책의 대상인지
- Privileges : 어떤 정책을 포함하는지

### Metadata Policies

Metadata Policies는 Platform Policies의 플랫폼 관점에서의 접근 제어 및 정책을 결정하는 개념이 아닌 **메타데이터** 관점에서 결정하는 정책입니다.

예를 들면

- 특정 유저(혹은 그룹)가 특정 URN을 조회 할 수 있는 권한
- 특정 유저(혹은 그룹)가 Tags/glossaryTerm/Owner 를 변경 할 수 있는 권한

등이 있습니다. 이 또한 공식 문서에 포함되어 있습니다. 이러한 정책은 gms 서버에 관련 기능을 enable 하는 것으로 UI 상에서 쉽게 조회 할 수 있습니다.

## Role

[Role](https://datahubproject.io/docs/authorization/roles)은 접근을 제어하는 역할을 의미합니다. Policy를 다룬 직후 Role에 대한 정의를 보게되면 **"Policy"**와는 어떤 점이 다른 건지 모호하게 느껴 질 수 있습니다.

일단 Role의 경우에는 다음과 같이 구성되어 있습니다.

- Admin : 플랫폼 내 모든 권한을 가집니다.
- Editor : 모든 메타데이터를 조회 및 수정 할 수 있지만, Admin의 고유 권한은 없습니다.
- Reader : 모든 메타데이터를 조회 할 수 있습니다.

공식 문서에 따르면 **"Role은 Policy와 완벽 호환되며, Role에 대한 정책을 건드릴 수 없지만 특정 Policy를 추가하면 개별적인 권한을 부여 할 수 있다"**고 적혀있습니다. 예시에서는 Role에 포함 된 권한에 추가적인 Policy를 부여하는 것을 보여주었지만, 반대의 경우 Role의 권한 중 특정 Policy를 제외 할 수 있는지도 알아봐야 할 것 같습니다.

## Access Token (Personal Access Token)

[Access Token](https://datahubproject.io/docs/authentication/introducing-metadata-service-authentication)은 Datahub의 내부 아키텍처에서 사용되는 토큰 값입니다.

공식 문서에는 Datahub 내에서 별도의 Access Token을 사용하게 된 히스토리에 대해 적혀있습니다.

기존에는 datahub-frontend에서 사용하는 유저의 ID와 PW를 이용해서 플랫폼의 인증을 수행했습니다. 그리고 datahub-actions에서 요청을 만들어 datahub-gms를 통해 데이터를 Ingestion하는 로직도 이러한 ID와 PW를 해싱하여 Basic 인증으로 진행했었습니다.

이 경우 gms 자체에 대한 보안이 이루어지기 어려운 부분이 있습니다. 만약 웹 UI내의 주입 파이프라인에서 이러한 데이터를 활용한다면 특정 유저의 계정과 비밀번호를 해싱 한 값을 SECRET에 추가하고 아마 salt와 같이 보안성을 추가 할 수 있는 값을 SECRET에 추가 한 뒤에 gms에 인증 키로 활용 할 것 같습니다. 즉, 한 번 계정 정보가 유출되면 그대로 gms는 모든 데이터에 접근 할 수 있게 됩니다.

그래서 Access Token을 별도로 만들고 expire_date를 설정 할 수 있도록 하여 보안성을 높이고, 활용성도 높이는 방향으로 동작하게 만들었습니다.

하지만 이 Access Token을 통한 인증 방식이 반영 된 지 그리 오래되지 않아서 helm에서 가져온 gms에 요청하는 코드를 보면 아직 Basic 요청으로 계정 정보로 통신하도록 코드가 짜여져 있습니다.

## View

Datahub에서 말하는 View는 Datahub의 Web UI에서 어떠한 정보를 볼 때 사용되는 개체를 말합니다.

## Deprecation

Datahub에서는 Entity에 대해서 Deprecation 되었음을 표시 할 수 있습니다.

## Ingestion Source

Datahub의 꽃인 Ingestion을 위한 소스 정보입니다. Ingestion의 동작 방식은 다음의 두 개로 나누어집니다.

1. Push-based
	- Airflow, Spark, Great Expectation과 같은 플랫폼을 주입할 때 주로 사용하는 방식이고, row-latency를 유지하기 위해서 메타데이터의 변경 사항을 직접 푸시하는 방식으로 동작합니다.
	- 이 방식은 json 파일로 만들어진 메타데이터를 직접 Push하는 방법으로도 Datahub에 주입 할 수 있는 방안이 됩니다.
2. Pull-based
	- Bigquery, redshift, RDB등 다양한 데이터 베이스에서 Datahub가 접근하여 데이터를 얻어오는 방식으로 데이터를 주입하는 방식입니다.
	- Pull-based는 기본적으로 다수의 쿼리가 사용 될 수 있기 때문에 데이터베이스가 받는 부하가 큰 편입니다. 이런 이유로 서비스 데이터베이스를 연동 할 때 주의가 필요합니다.

## Container

Container는 관련이 있는 데이터 셋들의 집합입니다. 기술 문서를 읽으면 내부에 다양한 개별적인 셋들이 있는 것을 확인 할 수 있습니다.

특정 컨테이너 안에 해당 셋들의 집합이 있다는 것으로 해석 할 수 있을 것 같습니다.

## DataPlatform

DataPlatform은 현재 Datahub에서 사용되고 있는 다양한 데이터 플랫폼의 정보라고 생각 할 수 있습니다. 우리가 주입 할 때 접근하는 플랫폼 등이 이에 해당합니다.

공식 문서의 Concepts에는 해당하는 플랫폼의 리스트가 있습니다.

## Dataset

Datahub에서 Dataset은 주입 된 데이터에 대한 정보 중에서 다음과 같은 정보를 포함합니다.

- Table / View
- Streaming 플랫폼의 Streams
- Datalake 내의 파일이나 오브젝트

Dataset에 대해서는 조금 더 깊게 이해 할 필요가 있습니다. 그 이유는 우리가 결국 원하는 데이터 카탈로그 관리의 주체가 바로 Dataset이기 때문입니다. Dataset 내에는 어떻게 구성되어 있으며, 만약 우리가 커스텀 주입 파이프라인을 작성 할 때 어떤 메타데이터를 어떻게 다루어야 하는지를 이해 할 수 있습니다.

가장 먼저 살펴 볼 내용은 [Dataset의 공식 문서](https://datahubproject.io/docs/generated/metamodel/entities/dataset)입니다.

### 첫 번째로 주목 할 내용은 다양한 데이터 플랫폼에서 주입받으면서 고유한 URN을 유지하는 방안입니다.

URN에 데이터베이스 명과 스키마 명, 그리고 테이블 및 뷰 명등을 차례로 명시하여 중복 된 URN으로 만들어지지 않도록 컨트롤합니다.

예시로는 문서에 있는 다음과 같은 URN입니다.

```
urn\:li\:dataset\:(urn\:li\:dataPlatform\:redshift,userdb.public.customer_table,PROD).
```

### 두 번째는 Dataset의 내부에 정의 된 속성들입니다.

Dataset에는 다양한 속성이 포함되어 있습니다. 정확히는 Aspects(Aspects에 대한 이야기는 아래에서 따로) 입니다. Datahub에서 이러한 속성을 Aspect라는 명칭으로 부르고 있음에도 Important Capabilities이라는 단어로 표현 한 Aspect가 있습니다. 

Dataset의 Aspect가 대부분의 경우가 대부분의 데이터 카탈로그 시스템 구축에 핵심이라고 말 할 수 있습니다. 그래서 Dataset의 Aspect에 대해서 이야기해보도록 하겠습니다.

```
*참고로 Dataset 말고도 다른 Entity도 중복 된 Aspect를 가지고 있을 수 있습니다.*
```

#### Tags and Glossary Terms

Tag는 Entity에 대한 키워드로 검색이나 정책 설정등에 활용가능 한 정보입니다. Tag라는 Entity를 다루면서 더 자세하게 이야기 할 예정이지만, 기본적으로 Dataset의 Tag는 도메인 탐색과 검색에 매우 큰 영향을 끼칩니다.

Glossary Terms는 용어집으로 Dataset 내에서 용어에 대한 설명이 필요 할 수 있습니다. 특정 도메인에 속한 데이터일수록 Description은 약어와 사내 용어를 사용 할 가능성이 높습니다. 이럴 때 용어집 설정은 이해도에 큰 도움을 줄 수 있습니다.

#### Ownership

Ownership은 말 그대로 특정 Dataset에 대한 Owner를 가지는 유저입니다. 데이터를 주입하면서 알게 된 사실인데, 주입하는 파이프라인 중에 관련 Owner가 있다면 해당 정보도 반영해줍니다.

#### Fine-grained lineage

Lineage는 Dataset에 대한 계보로써 해당 Dataset으로부터 어떤 파이프라인으로 이어지는지(down-stream), 혹은 어느 파이프라인에서 이어지는지(up-stream)를 저장하고 시각화해주는 정보입니다. 이 경우 Airflow나 nifi 등의 파이프라인을 사용한다면 주요하게 확인해야 하는 부분입니다.

#### Domain

문서에서 주요한 기능이라는 단어로 표현하지 않았지만, Dataset을 특정 Container와 Domain으로 묶을 수 있습니다. 이 경우 데이터의 Ownership을 가진 사람이 더욱 관리하기 용이하게 만들어주고 동시에 구분하기 좋게 활용 할 수 있습니다.

## Chart

차트 정보입니다. Tableau, Looker 등의 시각화 대시보드를 제공하는 파이프라인을 연동하면 볼 수 있는 정보입니다. 하나의 Chart는 여러 대시보드에 포함되어 있을 수 있습니다.

## Dashboard

하나의 대시보드를 일컫습니다. 여러 Chart를 가진 대시보드라고 볼 수 있습니다.

## Data Job

데이터를 생성 및 소비하는 하나의 Task를 말합니다. Airflow의 경우로 예시를 들었는데, 하나의 Dag는 Dataset이겠지만 내부에서 동작하는 Task들은 Data Job이 된다고 이해했습니다.

## Data Flow

Data Flow는 Airflow에서 하나의 Dag(정확히는 Dag_run)에서 동작하는 일련의 Task의 파이프라인을 말하는 것 같습니다. 현재 사내에서 사용중인 NIFI에 대해서도 이러한 Data Flow를 그리는 것 같습니다.

## Glossary Term (Group)

Glossary Term은 용어집입니다. [공식 문서](https://datahubproject.io/docs/glossary/business-glossary)에서는 다음의 두 유형의 Glossary Term의 Entity로 Glossary Term에 대해 설명하고 있습니다.

1. Glossary Term Group
	- 용어집을 담는 하나의 폴더와 같은 동작을 합니다. Glossary Term을 담거나 혹은 또 다른 Group을 포함합니다.
2. Glossary Term
	- 하나의 용어에 대한 Entity입니다.
	- 내부에 관련 Document와 관련 Glossary Term, 속성등이 포함되어 있습니다.

Glossary Term에 대한 정책도 개별적인 Glossary Term Group에 대한 권한으로 분리 할 수 있음을 알려줍니다. 뿐만아니라 Glossary Term에 대한 관리를 Git을 이용하여 할 수 있다는 노하우를 알려주고 있습니다. 이 부분은 추후에 자세하게 알아보고 적용 할 수 있으면 적용해 볼 예정입니다.

## Tag

Tag는 Datasets, Dataset Schemas, Containers에 부여하여 검색과 탐색에 용이하게 사용 할 수 있는 일종의 키워드입니다. 데이터를 검색하는 과정에서 비즈니스 용어를 통해 찾는 것 보다 더욱 명확하게 접근 할 수 있는 장점이 있습니다.

Tag는 협업 과정에서 동료들에게 같은 Dataset을 쿼리 할 수 있는 방안(검색과 탐색) 외에도 여러 Dataset을 하나의 카테고리로 묶을 수 있는 방안으로 사용 될 수 있습니다.

[공식 문서](https://datahubproject.io/docs/tags)에서는 더욱 자세한 내용을 포함하고 있습니다.

그 중 중요한 내용에 대해서 조금 더 짚어보겠습니다.

### Range

Tag는 다음의 두 곳에 설정 할 수 있습니다.

1. Entity
	- Entity에 대한 Tag를 설정하여 활용 할 수 있습니다.
2. Column
	- Entity(Dataset)내의 Column에도 Tag를 설정하여 활용 할 수 있습니다.

### What different from Glossary Terms / Domains

#### Glossary Terms

Tag는 언뜻보면 용어에 대한 집합으로 사용 할 수 있을 것 같습니다. 예를들면 Dataset의 Column에 Description을 설정 한 뒤 같은 컬럼에 대해 같은 Tag를 설정하면 마치 용어집처럼 사용되지 않을까 생각됩니다만, 다음의 부분에서 차이가 있습니다.

- 하나의 Column에 대해 여러 Tag를 설정 할 수 있습니다.
- 검색과 탐색 과정에서 Glossary Term은 낮은 수준의 우선순위를 가집니다. 일반적으로 Tag를 기반으로 검색 및 탐색 우선순위를 관리합니다.

[두 Entity의 사용 시나리오에 대한 공식 블로그 포스트](https://blog.datahubproject.io/tags-and-terms-two-powerful-datahub-features-used-in-two-different-scenarios-b5b4791e892e)가 있습니다.

#### Domains

마찬가지로 같은 Domain에 해당하는 Entity(Dataset)에 대해서 같은 Tag를 추가한다면 Domain을 대신 할 수 있을 것 같은 기분이 듭니다. 하지만 마찬가지로 다음의 부분에서 차이가 있습니다.

- Domain은 최우선 카테고리로 중앙/분산 도메인 관리에 주로 사용되며, 검색 및 탐색에 우선순위에 큰 영향을 미칩니다.

## Owner

특정 Entity에 Owner를 설정하여 해당 Entity에 대한 책임자를 설정 할 수 있습니다.

## User / Group

User와 Group은 각각 유저와 유저가 포함 된 Group을 말합니다. Role과 Owner의 타겟이 되는 부분이니 두 Entity를 포함한다고 보시면 좋을 것 같습니다.

추가적으로 간단히 알아보자면 Datahub 내부에서 두 개체를 말하는 Entity 이름은 CorpUser와 CorpGroup입니다.



