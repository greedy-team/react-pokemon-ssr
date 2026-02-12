# Step 2. Express 서버 구성

브라우저의 요청을 받아 서버에서 React를 HTML로 변환하여 응답하는 서버를 구성합니다.

## 사전 준비

Express와 타입 정의를 설치합니다.

```bash
npm install express
npm install -D @types/express
```

## 기능 요구사항

- Express 서버를 생성합니다.
- 개발 환경에서 Vite를 미들웨어 모드로 연동합니다.
- `index.html`을 템플릿으로 사용하여, 서버 렌더링 결과를 주입한 뒤 응답합니다.
- 정적 파일(JS, CSS, 이미지)은 정상적으로 서빙되어야 합니다.
- 기존 `dev` 스크립트는 Vite 개발 서버를 직접 실행합니다. SSR 전환 이후에는 Express 서버가 진입점이 되므로, 서버를 실행하는 방식을 변경해야 합니다.

## 완료 기준

- 서버를 실행할 수 있다.
- `curl http://localhost:PORT`의 응답 HTML에 React 컴포넌트의 마크업이 포함되어 있다.
- 브라우저에서 접속하면 페이지가 표시된다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 키워드

- Vite의 `createServer`와 `middlewareMode` 옵션
- `vite.ssrLoadModule`
- `vite.transformIndexHtml`
- [Vite - Server-Side Rendering](https://ko.vite.dev/guide/ssr)
