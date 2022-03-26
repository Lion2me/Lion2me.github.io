---
layout: post
title: Spring Boot
date: 2021-09-25 21:05:23 +0900
category: Spring
use_math: true
---

Spring Boot
---

이전 회사를 다닐 때 Spring Framework로 프로젝트를 진행했었는데 이번에 Spring Boot를 공부하면서 "아.. 내가 너무 부족했구나"라는 생각을 하고 다시 공부를 시작합니다.

~~공부할게 많아서 정말 정말 행복하지만! 재취업 먼저 되었으면..!~~

## Spring Boot가 무엇인가?

기본적으로 Spring Framework의 업데이트 버전으로 이해 할 수 있습니다.

기존의 Spring Framework는 웹 애플리케이션을 만들기 위해서는 정말 다양한 설정을 거치고, 그 설정에 대해서 이해해야 했습니다. 하지만 Spring Boot는 그러한 설정을 매우 간략하게 만듭니다.

그럼 얼마나 편해졌는지 확인해보겠습니다.

### 의존성

```java
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
implementation 'org.springframework.boot:spring-boot-starter-mustache'
implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-parent'
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'org.springframework.boot:spring-boot-starter-webflux'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
```

Gradle로 설정 한 위의 의존 라이브러리들을 보시면 대부분 spring-boot-starter로 시작하는 것을 알 수 있습니다.

각각의 의존 라이브러리 내에는 해당 기능과 관련 된 모든 라이브러리가 포함되어 있습니다.

예를들면 starter-test를 보시면, JUnit이나 AssertJ, JsonPath, SpringTest 등 다양한 라이브러리등이 포함되어 있습니다.

기존의 springframework를 이용해서 Maven을 이용한다면 아마 수십줄의 코드가 적혀야 했을 것입니다.

~~내가 이걸 이제 알다니~~

### DB설정

자바를 통해 DB를 연결한다면 기본적으로 JDBC를 연결해야 합니다.
그리고 이전의 포스트에서 적은 내용처럼 Spring에서는 자체적으로 Spring JDBC를 제공합니다.

Spring Framework의 JDBC를 통해 DB에 연결하려면, 가장 처음으로 해당 Bean을 만들어야 합니다.

Spring JDBC 객체를 만들기 위해 데이터베이스의 DATABASE path, id, password, RDBMS Driver 정보를 입력해주고 Spring JDBC를 만들어주고 ORM이나 SQLMapper를 사용 할 경우 관련 빈을 생성할 떄 Spring JDBC를 사용해줍니다.

관련 문서를 참조하면 어려운 일은 아니지만, Spring Boot는 차원이 다릅니다.

```yml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/test
    driver-class-name: org.mariadb.jdbc.Driver
    username: id
    password: password
  jpa:
    open-in-view: false
    generate-ddl: true # table을 새로 만들건지
    show-sql: true
    hibernate:
      ddl-auto: validate # ddl(table 관련) 유지 방식?
```

깔끔하게 정리 됩니다.

## Spring Security 적용

이전 Spring Framework 3 버전을 사용 했을 떄 Spring Security를 적용하기 위해서 Security 관련 xml을 별도로 만들고 관리했었습니다.

속성값을 이용해서 세션 정보를 수정하기도했고, 핸들러를 적용하거나 URL 설정등을 했었죠.

하지만 Boot 5에서는 WebSecurityConfigurerAdapter를 상속받은 클래스를 통해서 설정 할 수 있습니다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception{
      http
        .csrf().disable() // csrf를 비활성화 합니다!
          .authorizeRequests() // 인가 과정에서 url 별 접근 권한을 나눕니다.
              .antMatchers("/admin/**").hasRole("ADMIN")
              .antMatchers("/user/**").hasRole("USER")
              .antMatchers("/signup").hasRole("ANONYMOUS")
              .anyRequest().permitAll()
              .and()
          .formLogin() // 로그인 시 입력 폼에서 입력 받을 내용을 설정합니다. 여기서 핸들러 설정도 가능해요!
                      .loginPage("/loginForm")
                      .usernameParameter("username")
                      .passwordParameter("password")
                      .loginProcessingUrl("/login")
                      .successHandler(new myLoginSuccessHandler())
                      .failureHandler(new myLoginFailureHandler())
                      .permitAll()
              .and()
           .logout() // 로그아웃도 가능합니다.
               .permitAll()
               .logoutUrl("/logout")
               .logoutSuccessUrl("/")
               .and()
           .exceptionHandling()
               .accessDeniedPage("/accessDenied_page");
    }
}
```

#### 리액티브 프로그래밍

이 부분부터 대략 정신이 멍해집니다.

리액티브 프로그래밍 심지어 자바를 이용해서 Spring에 사용하는 webflux는 추후에 공부를 하고 포스팅하도록 하겠습니다.

---

스프링 부트 공부를 시작하면서 느낀 점은, Spring Framework로 개발을 시작한 제가 다시 한번 "무언가 만들어 볼 수 있겠다"는 자신감이 생기는 기분입니다.

<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>
