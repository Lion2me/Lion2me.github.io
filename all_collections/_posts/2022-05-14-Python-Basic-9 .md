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

## 테스트와 디버깅

이 포스트는 Effective Python를 번역 한 "파이썬 코딩의 기술"을 읽고 적는 포스트입니다.

---

### 테스트 할 때 \_\_repr\_\_를 사용하자

print 함수를 사용하면 문자열 5와 숫자 5가 다른 객체인지 알 수 없기 때문에 이러한 방법을 추천합니다.

### TestC