---
layout: post
title: MacOS 에서 Mecab 설정하기
date: 2021-03-03 19:20:23 +0900
category: NLP
---


MacOS 기반 Mecab 설정하기
---

#### 1. 형태소 분석기

한국어는 상당히 많은 형태소로 이루어져 있습니다. 명사/형용사/부사 외에도 다양한 종류의 형태소가 존재하는데 형태소 분석기는 문장을 그러한 형태로 나누어 사용할 수 있도록 도와주는 도구입니다.

형태소 분석기는 다양한 종류가 있습니다. Java를 기반으로 동작하는 Komoran부터 시작해서 한나눔(Hananum), 꼬꼬마(KKma), 리눅스를 기반으로 동작하는 Mecab, 카카오에서 CNN을 기반으로 만든 Khaii까지 지금까지도 지속적으로 발전하고 있는 분야 중 하나입니다.

##### 1 - 1 ) 왜 형태소 분석이 필요한가?

문장을 형태소로 나누는 것은 거의 모든 임베딩 과정에 포함되어있습니다. 그 이유는 바로 **텍스트 분석에서 대부분의 분석 대상은 문장이 아닌 단어** 이기 때문입니다.

문장을 분석하기 위해서는 문장에서 단어를 추출하는 과정이 필요합니다. 특히 분류와 같은 모델을 만들기 위해서는 그저 추출하는 것이 아닌 **가장 특징적인 의미를 갖는 단어** 를 추출하는 과정이 필수적이죠.

그리고 우리는 단어를 벡터화하는 방식도 사용합니다. 자세한 내용은 [링크]애서 확인 하시면 될 것 같습니다. 간단히 말하면 BagOfWords 형식과 Distributed Representation 방식이 존재합니다.

두 방식 모두 단어를 벡터로 변환하는 방식으로 작동하니 우리는 문장을 단어 단위로 나누는 작업을 거치게 됩니다. 그 과정에서 바로 형태소 분석은 매우 유용한 방법으로 생각됩니다.

##### 1 - 2 ) 왜 Mecab인가?

은전(eanjeun) 이라는 별칭을 가진 Mecab의 특징은 다른 형태소 분석기에 비해 빠른 속도를 가진다는 점과 단어 자체의 원본을 파괴하기 않는다는 장점이 있습니다.

Komoran / Kkma / Twit(Otk) / Mecab을 한번 비교해보겠습니다.

"형태소 분석기를 테스트해보기 위해 다음과 같은 문장을 준비했다. 문장이 짧을 수 있으므로 이 문장을 추가적으로 덧붙였다." 이 문장을 각각의 형태소 분석기를 이용해 Tagging 해 보겠습니다.

![ex_screenshot](/public/img/pos_tag.png)

주목할 점은 "했"을 분석해보았을 때 Mecab은 [했, XSV+EP] 와 같이 단어를 파괴하지 않고 분석하며 다른 곳에서는 [하,앗[었],다] 처럼 나누어 분석하는 것을 볼 수 있습니다. 또한 Okt는 동사라는 큰 단위[했다]로 묶기도 합니다.

저는 가능한 단어 형태를 유지한 형태소를 얻고 싶기 때문에 Mecab을 사용할 생각이고 또한 KKma의 경우 "추가적"이라는 단어를 명사로 분석하는 것을 볼 수 있는데, 분석이 완전하지 않을 경우 고유명사로 판별하는 등의 문제가 있을 수 있기 때문에 Komoran과 Mecab을 주로 사용하고 있습니다.

#### Mecab 설치

저는 파이썬 환경에서 Mecab을 사용하고자 설치를 시작했습니다. Konlpy라는 한국어 NLP를 도와주는 라이브러리에서 Mecab을 쉽게 사용할 수 있도록 지원하고 있지만 단순히 pip를 통한 konlpy 라이브러리 다운로드만으로 사용할 수 없습니다.

**가상환경을 사용하고 있다면 터미널 사용 시 활성화한 채로 진행해주세요**

##### 2 - 1 ) Konlpy 설치

리눅스 혹은 MacOS에서 터미널을 통해 다음의 명령어를 실행시키면 쉽게 konlpy를 설치 할 수 있습니다.

```
pip3 install konlpy
```

##### 2 - 2 ) Mecab-ko 설치

위의 konlpy만을 설치하고 파이썬에서 실행 시 에러를 보실 수 있습니다. 그 이유는 konlpy는 Mecab을 사용하기 쉽게 도와줄 뿐 사전과 실행 파일등은 따로 다운로드 해야하기 때문입니다.

https://bitbucket.org/eunjeon/mecab-ko/downloads/

위 링크에서 가장 최근의 mecab 파일을 다운받고서 다음의 명령어를 실행하면 Mecab 프로그램을 다운로드 받을 수 있습니다.

```
tar xvfz mecab-0.996-ko-0.9.2.tar.gz
cd mecab-0.996-ko-0.9.2
./configure
make
make check
sudo make install
```

##### 2 - 3 ) Mecab-ko-dic 설치

Mecab-ko-dic은 Mecab에서 사용하는 사전을 정의할 수 있는 폴더입니다.

https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/

마찬가지로 위 링크에서 가장 최근의 mecab-dic 파일을 받고 명령어를 입력하시면 됩니다.

```
tar xvfz mecab-ko-dic-2.1.1-20180720.tar.gz
cd mecab-ko-dic-2.1.1-20180720
./configure
make
sudo make install
```

##### 2 - 4 ) Mecab-python 설치

Mecab을 파이썬에서 사용하기 위해서는 다음의 명령어를 실행시켜주시면 됩니다.

```
git clone https://bitbucket.org/eunjeon/mecab-python-0.996.git
cd mecab-python-0.996
python setup.py build
python setup.py install
```

하지만 저는 이 방법을 이용해도 파이썬에서 실행되지 않았습니다. MacOS의 경우 이런 문제가 생길 수 있으니 그 경우에는 pip을 이용하여 다운로드 받을 수 있습니다.

```
pip3 install mecab-python3
```

여기까지 마친다면 파이썬에서 실행시킬 수 있습니다.

다음 블로그를 참고하고 작성했습니다.

https://lovablebaby1015.wordpress.com/2018/09/24/mecab-macos-설치-삽질-후기-작성중/
