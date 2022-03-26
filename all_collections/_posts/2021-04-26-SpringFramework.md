---

layout: post

title: Spring Framework

date: 2021-04-26 21:05:23 +0900

categories: Spring

---

스프링 프레임워크
-----------------

스프링 프레임워크는 자바 플랫폼을 위한 오픈소스 애플리케이션 프레임워크입니다.

기업 규모의 애플리케이션 개발을 위해 만들어졌으며 대규모 데이터 처리에 적합하게 만들어졌습니다. 또한 스프링 컨테이너에 자바 객체를 담고 직접 관리해주는 IOC기반의 프레임워크입니다.

### 1. 제어의 역전 (IOC)

스프링 프레임워크의 **프레임워크** 라는 단어는 우리의 개발을 용이하게 해주고 효율을 높여주는 도구라고 말할 수 있습니다. 그리고 프레임워크가 제공하는 사용자가 제어해야하는 객체의 생성부터 생명주기까지 이러한 부분을 특정 객체에 위임하는 것을 제어의 역전(IOC)이라고 합니다.

스프링 프레임워크에서 제어의 역전이 일어나는 방식은 객체를 생성할 때 의존성을 주입(DI)해주는 방식으로 작동합니다. 원래라면 객체를 생성하고 사용하면서 새로운 객체를 동적할당(생성)하여 사용합니다. 하지만 스프링 프레임워크는 빈(Bean) 개념을 사용하여 더욱 쉽게 의존성을 주입할 수 있습니다.

여기서 빈(Bean)이란 스프링 컨테이너가 제어하고 만들고 관계를 부여하는 객체를 말합니다.

기존의 구현 방식은 다음과 같습니다.

```java
public class CarService {
    public void drive(){
        CarRepository CarRepository = new Drive();
        CarRepository.driveCar();
    }
}
```

이 소스에서는 CarService는 Drive 클래스에 의존하는 상태가 됩니다. 이 경우에는 다른 함수에서 Drive 클래스로 생성한 객체를 사용할 수 없게 됩니다. 만약 사용하려면 또 다시 생성해야하는 어려움이 있습니다.

그러면 하나의 방법은 있습니다. 바로 클래스 내에서 사용 할 수 있는 객체를 생성하고 생성자에서 해당 클래스를 인자로 받아 의존성을 주입하는 방식입니다.

```java
public class CarService {
    private CarRepository carRepository;

    public CarService(CarRepository carRepository){
        this.carRepository = carRepository;
    }

    public void drive(){
        carRepository.driveCar();
    }
}
```

위의 소스를 보면 처음에 private 접근 지정자를 통해 외부에서 접근 할 수 없는 **빈 객체** 를 만들고 생성자가 실행되기 전 까지 비어있는 모습을 볼 수 있습니다. 이 후 생성자에서 인자로 받은 값을 객체에 넣어주는 방식으로 작동하는 것을 볼 수 있습니다.

여기서 스프링 프레임워크에서는 이런 의존성을 주입해주며 객체의 생성과 소멸을 자동으로 지원해주는 **빈(Bean) 컨테이터** 를 지원합니다.

위에서 본 생성자를 이용하는 경우도 의존성을 주입하는 방식이 될 수 있지만, 생성자는 여러개가 있을 수 있고 사용하기에 따라 다른 작업을 해야 할 수도 있습니다.

빈 컨테이너를 이용하면 다음과 같이 간단한 방식으로 사용할 수 있습니다.

```java
@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    public void drive(){
        carRepository.driveCar();
    }
}
```

Service는 해당 클래스가 실제 사용되는 비즈니스 로직임을 알려주는 어노테이션입니다.

여기서 중요한 점은 Autowired 어노테이션인데, 생성자나 setter, 필드값에 사용할 수 있으며 해당하는 타입과 동일한 클래스의 bean을 찾아서 해당 객체에 넣어주게 됩니다.

이렇게 CarService는 CarRepository에 대해 의존성을 가지게 됩니다.

매번 생성되는 동적할당 방식이 아닌 싱글톤 방식으로 빈 컨테이너에 생성되기 때문에 1개의 객체만이 생성되는 것을 확신할 수 있고, 동시에 메모리 낭비도 줄어들게 됩니다. 또한 전역 인스턴스이기 때문에 다른 클래스의 인스턴스에서도 사용하기 쉽습니다.

IOC를 통해 결합도를 낮출 수 있다?

#### 생성자 주입을 해야하는 이유?

1.	객체의 불변성

수정자 주입이나 필드 주입을 사용할 경우 불필요하게 수정을 할 일이 생길 수 있다(OCP 개방 폐쇄 원칙). 상황에 따라 수정자 주입을 사용하는 경우도 있지만, 일반적으로 생성자 주입을 이용한다.

1.	순환 참조 문제의 발견에 용이

개발을 진행하며 순환 참조의 경우 오버플로우가 발생할 수 있는 문제를 미리 알 수 있다. 이유는 빈 객체를 생성하는 과정에서 순환 참조가 발생을 알 수 있기 때문

### 2. AOP ( 관점 지향 프로그래밍 )

AOP는 말 그대로 특정 관점에서 모듈화를 진행하는 방식입니다. 예를 들면 특정 서비스를 제공하면서 소요되는 시간에 대한 로그를 얻고 싶을 경우에 서비스의 진행 관점에서 타이머를 만들 수 있습니다.

주요개념은 다음과 같습니다.

-	Aspect : AOP의 기본 모듈이며, Aspect 어노테이션을 붙인 클래스와 클래스 내의 모든 메소드는 AOP를 사용할 수 있는 Target으로 사용 될 수 있습니다. (* 참고로 AOP는 스프링 빈에만 사용할 수 있기 때문에 @Component나 @Bean 이 포함된 어노테이션을 함께 사용해야합니다. )
-	Target : Aspect로 설정 된 클래스에 대해서 내부의 모든 메소드 및 클래스를 지정할 수 있습니다. Advice를 더하면 특정 관점을 가리키는 Advicer가 됩니다.
-	Join Poing : Advice가 적용 될 수 있는 위치로 Target으로 지정 된 클래스 내 모든 메소드는 Join Point가 됩니다.
-	Pointcut : 해당 Advice를 적용 할 메소드를 선별하는 **정규표현식** 이다. execution으로 시작합니다.
-	Advice : Target에게 부여할 특성입니다. 다양한 Advice가 있는데 before(시작 전), after(종료 후), around(언제든지) 등의 방식이 있습니다.

AOP는 다음과 같은 특징을 가지고 있습니다.

-	프록시 패턴 기반의 AOP구현체를 사용합니다.
-	스프링 빈에만 사용 가능합니다.

### 3. POJO (Plain Old Java Object)

POJO는 가장 기본적인 자바 프로그래밍 방식을 사용하여 구현하는 방식입니다. 그래서 약자에 Plain Old라는 말이 들어간 것 같습니다.

기업에서 자바 프로젝트를 진행 할 때 도움을 주기위해 기존에 만들어진 방식이 있습니다. EJB (Enterprise Java Bean)은 자바를 이용한 프로젝트를 개발하기 쉽도록 만들어진 방식입니다. 하지만 부품화 되어있는 EJB를 사용하기 위해 불필요한 소스가 늘어나게 되어 성능과 이동성이 좋지 않았습니다.

애초에 EJB에서 해결하고 싶었던 문제는 필요한 기능에 대한 의존성 문제와 트랜잭션 처리였기 때문에 이 방식을 해결하기 위해 POJO를 이용한 스프링이 만들어졌습니다.

### 4. MVC (Model View Controller) 구조

MVC구조는 사용자 인터페이스와 실제 비즈니스 로직을 구분하는 구조입니다.

Model은 실제로 데이터를 처리하는 로직을 말합니다. 일반적으로 Service 와 DAO라는 구조를 이용하며 Service에서는 세부적인 비즈니스 로직을 처리를 담당합니다. 그리고 DAO는 데이터베이스를 통한 CRUD 처리를 전담하고 있습니다. **View와 Controller의 정보를 가지고 있으면 안됩니다.**

View는 사용자 인터페이스를 일컫는 부분으로 사용자가 비즈니스 로직에 접근 할 수 있도록 Controller에게 요청을 하는 로직등을 가지고 있습니다. **Model이 가진 정보를 저장해서는 안됩니다.**

Controller는 사용자에게 요청이 들어왔을 때 요청을 받아 원하는 응답을 리턴하는 방식으로 작동합니다. 결과로 View를 리턴할 수 있고 추가적으로 Model을 통해서 처리 된 데이터를 함께 리턴할 수 있습니다. Attribute에 담거나 ModelAndView를 통한 리턴이 가능합니다. 그러므로 **View의 정보와 Model의 정보를 알고 있어야 합니다.**

#### 참고

-	<https://dpdpwl.tistory.com/140>
-	<https://devlog-wjdrbs96.tistory.com/166>
-	<https://mangkyu.tistory.com/125?category=761302>
-	<https://engkimbs.tistory.com/746>
-	<https://shlee0882.tistory.com/206>
-	<https://khj93.tistory.com/entry/Spring-Spring-Framework%EB%9E%80-%EA%B8%B0%EB%B3%B8-%EA%B0%9C%EB%85%90-%ED%95%B5%EC%8B%AC-%EC%A0%95%EB%A6%AC>
