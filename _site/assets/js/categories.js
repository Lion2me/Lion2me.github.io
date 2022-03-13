const categories = { fiction: [{ url: `/posts/the-purpose-of-education/`, date: `12 Dec 1948`, title: `The Purpose of Education`},],jekyll: [{ url: `/posts/jekyll-markdown/`, date: `04 Nov 2021`, title: `Jekyll Markdown`},{ url: `/posts/the-purpose-of-education/`, date: `12 Dec 1948`, title: `The Purpose of Education`},],Data: [{ url: `/posts/Mac-OS-Spark%EC%84%A4%EC%B9%98/`, date: `02 Mar 2021`, title: `MacOS 에서 Spark 설치하기`},{ url: `/posts/SparkStart/`, date: `03 Aug 2020`, title: `Spark란`},],NLP: [{ url: `/posts/%EC%83%81%EB%8C%80%EC%A0%81-%EC%B6%9C%ED%98%84-%EB%B9%84%EC%9C%A8%EC%9D%84-%ED%86%B5%ED%95%9C-%ED%82%A4%EC%9B%8C%EB%93%9C%EC%B6%94%EC%B6%9C/`, date: `03 Apr 2021`, title: `상대적 출현 비율을 통한 키워드 추출`},{ url: `/posts/Find-Similar-Docs-Using-FastText/`, date: `11 Mar 2021`, title: `Finding Similar Docs Using Fasttext`},{ url: `/posts/FastText-Using-Subword/`, date: `05 Mar 2021`, title: `FastText Using SubWord`},{ url: `/posts/Mac-OS-Mecab%EC%84%A4%EC%A0%95/`, date: `03 Mar 2021`, title: `MacOS 에서 Mecab 설정하기`},{ url: `/posts/Doc2VecClustering/`, date: `01 Jan 2021`, title: `Doc2Vec to Clustering`},{ url: `/posts/Vector-Space-To-Word/`, date: `13 Sep 2020`, title: `Vector Space To Word Analysis`},],ML: [{ url: `/posts/CNN%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C/`, date: `25 Sep 2021`, title: `CNN에 대해서`},{ url: `/posts/Gradient%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C/`, date: `23 Sep 2021`, title: `Gradient에 대해서`},{ url: `/posts/%ED%8E%B8%ED%96%A5%EA%B3%BC-%EB%B6%84%EC%82%B0/`, date: `03 Sep 2021`, title: `편향과 분산`},{ url: `/posts/%EA%B0%95%ED%99%94%ED%95%99%EC%8A%B5%EC%9D%B4%EB%9E%80/`, date: `17 Aug 2021`, title: `강화학습의 시작`},{ url: `/posts/%EC%84%A0%ED%98%95-%ED%9A%8C%EA%B7%80-%EB%B6%84%EC%84%9D/`, date: `13 Jun 2021`, title: `선형 회귀 분석`},{ url: `/posts/Sequential-Models/`, date: `20 Dec 2020`, title: `Sequential Models`},{ url: `/posts/Clustering/`, date: `18 Oct 2020`, title: `Document Clustering using Kmeans`},],Vision: [{ url: `/posts/ComputerVision-%EB%AA%A8%EC%84%9C%EB%A6%AC%EA%B2%80%EC%B6%9C/`, date: `18 Apr 2021`, title: `Computer Vision CornerDetection`},{ url: `/posts/Computer-Vision-%ED%9E%88%EC%8A%A4%ED%86%A0%EA%B7%B8%EB%9E%A8/`, date: `15 Apr 2021`, title: `Computer Vision Histogram`},],Spring: [{ url: `/posts/JPA%EB%8A%94/`, date: `15 Dec 2021`, title: `JPA`},{ url: `/posts/SpringBoot/`, date: `25 Sep 2021`, title: `Spring Boot`},{ url: `/posts/ORM%EA%B3%BC-SQLMapper/`, date: `20 Aug 2021`, title: `ORM과 SQLMapper`},{ url: `/posts/Spring-Security/`, date: `04 Jul 2021`, title: `Spring Security`},{ url: `/posts/JDBC%EC%99%80-Mybatis/`, date: `08 May 2021`, title: `Spring JDBC와 Mybatis`},{ url: `/posts/SpringFramework/`, date: `26 Apr 2021`, title: `Spring Framework`},],Basic: [{ url: `/posts/Thread%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C/`, date: `03 Sep 2021`, title: `Thread에 대하여`},{ url: `/posts/URL%EC%9E%85%EB%A0%A5-%ED%9B%84-%EC%9D%BC%EC%96%B4%EB%82%98%EB%8A%94-HandShake%EB%93%A4/`, date: `14 Jul 2021`, title: `URL에 접근 시 일어나는 Handshake`},{ url: `/posts/%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%AD%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC/`, date: `12 Jul 2021`, title: `메모리 영역에 대해서`},{ url: `/posts/HTTP1%EA%B3%BC-HTTP2%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC/`, date: `11 Jul 2021`, title: `HTTP의 버전에 따른 변화`},{ url: `/posts/URL%EC%9E%85%EB%A0%A5-%ED%9B%84-%EC%9D%BC%EC%96%B4%EB%82%98%EB%8A%94-%EC%9D%BC%EB%93%A4/`, date: `10 Jul 2021`, title: `URL에 접근 시 일어나는 일들`},{ url: `/posts/%EC%9D%B8%EC%A6%9D%EA%B3%BC-%EC%9D%B8%EA%B0%80/`, date: `03 Jul 2021`, title: `인증과 인가`},{ url: `/posts/Hash%EB%9E%80/`, date: `22 May 2021`, title: `Hash에 대해서`},], }

window.onload = function () {
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", function (e) {
      const posts = categories[e.target.innerText];
      let html = ``
      posts.forEach(post=>{
        html += `
        <a class="modal-article" href="${post.url}">
          <h4>${post.title}</h4>
          <small class="modal-article-date">${post.date}</small>
        </a>
        `
      })
      document.querySelector("#category-modal-title").innerText = e.target.innerText;
      document.querySelector("#category-modal-content").innerHTML = html;
      document.querySelector("#category-modal-bg").classList.toggle("open");
      document.querySelector("#category-modal").classList.toggle("open");
    });
  });

  document.querySelector("#category-modal-bg").addEventListener("click", function(){
    document.querySelector("#category-modal-title").innerText = "";
    document.querySelector("#category-modal-content").innerHTML = "";
    document.querySelector("#category-modal-bg").classList.toggle("open");
    document.querySelector("#category-modal").classList.toggle("open");
  })
};