---

layout: post

title: Spring JDBC와 Mybatis

date: 2021-05-08 21:05:23 +0900

categories: Spring

---

Spring JDBC와 Mybatis
---

### JDBC (JAVA DataBase Connectivity) 란?

JDBC는 자바와 데이터베이스를 연결하기 위한 API입니다. 또한 연결 된 데이터베이스에서 원하는 정보를 CRUD 작업을 수행할 수 있습니다.

#### 단점

- 쿼리를 실행하기 전후에 많은 코드를 실행해야합니다.
- 트랜잭션 관리를 해야합니다.
- 예외 처리에 대한 어려움이 있습니다.

### Spring JDBC는?

Spring에서 지원해주는 JDBC는 이러한 JDBC의 사용을 편리하게 바꾸어 제공합니다.

기존의 JDBC는 트랜잭션 관리를 직접해야하고 예외처리에 관한 처리도 해야 합니다. 또한 불필요한 반복이 많습니다.

하지만 Spring JDBC는 이러한 관리는 알아서 해주며, 불필요한 반복이 일어나는 단점도 해결한 형태입니다.

### Mybatis

Mybatis는 JDBC 사용을 쿼리 형식으로 편하게 사용할 수 있도록 지원하고 SQL쿼리를 xml파일로 별도로 분리 할 수 있도록 도와줍니다.

장점으로는 쿼리를 분리하여 보관함으로써 유지보수성이 높아지고, 소스는 간결해집니다. 또한 빠르게 개발이 가능합니다.

```xml
# JDBC 연결
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
    <property name="driverClassName" value="com.mysql.jdbc.Driver" />
    <property name="url" value="jdbc:mysql://127.0.0.1:3306/spring_tuto" />
    <property name="username" value="root" />
    <property name="password" value="beyondme" />
</bean>

# Mybatis 연결
<bean id="sqlSeesionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

다음과 같이 application context.xml에 Bean으로 등록해놓고 의존성을 주입받아 사용하는 방식으로 사용됩니다.

#### 참고

- https://shs2810.tistory.com/18
- https://khj93.tistory.com/entry/MyBatis-MyBatis란-개념-및-핵심-정리
