# Step2. Express 서버 구성

## 문제 상황

Step1에서 서버 엔트리를 만들었지만, 아직 이 코드를 실행하고 브라우저에 HTML을 전달해줄 서버가 없다.

> **생각해보기:** 브라우저가 `http://localhost:3000`으로 요청을 보내면, 누가 React 컴포넌트를 HTML로 바꿔서 응답해줘야 할까? 그리고 개발 중에 Vite의 [HMR](https://frontend-fundamentals.com/bundling/deep-dive/dev/hmr.html) 같은 기능은 어떻게 유지할 수 있을까?

## 사전 준비

Express와 타입 정의를 설치합니다.

```bash
npm install express
npm install -D @types/express
```

## 목표

브라우저의 요청을 받아 서버에서 React를 HTML로 변환하여 응답하는 Express 서버를 구성한다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: Vite를 어떻게 Express와 함께 쓸 수 있을까?</summary>

Vite는 `middlewareMode` 옵션으로 독립 서버 대신 Express의 미들웨어로 동작할 수 있다. `createServer`로 Vite 인스턴스를 만들고, `app.use(vite.middlewares)`로 연결한다.

</details>

<details>
<summary>힌트 2: index.html은 어떤 역할을 할까?</summary>

`index.html`을 템플릿으로 사용한다. `vite.transformIndexHtml`로 변환한 뒤, 서버 렌더링 결과를 주입하여 응답한다. HTML 안에 렌더링 결과가 들어갈 위치를 표시해두면 된다.

</details>

<details>
<summary>힌트 3: 서버 엔트리 모듈은 어떻게 불러올까?</summary>

`vite.ssrLoadModule`을 사용하면 서버 엔트리 파일을 동적으로 불러올 수 있다. 이를 통해 Step 1에서 만든 `render` 함수를 호출한다.

</details>

## 완료 기준

- 서버를 실행할 수 있다.
- `curl http://localhost:PORT`의 응답 HTML에 React 컴포넌트의 마크업이 포함되어 있다.
- 브라우저에서 접속하면 페이지가 표시된다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 스스로 확인해보기

- Vite의 `middlewareMode`는 왜 필요한가? 없으면 어떤 문제가 생기는가?
- `vite.ssrLoadModule`과 일반 `import`의 차이는 무엇인가?
- 기존 `dev` 스크립트와 새로운 서버 실행 방식은 어떻게 달라져야 하는가?

## 키워드

- Vite의 `createServer`와 `middlewareMode` 옵션
- `vite.ssrLoadModule`
- `vite.transformIndexHtml`
- [Vite - Server-Side Rendering](https://ko.vite.dev/guide/ssr)
