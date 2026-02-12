# Step 1. 엔트리포인트 분리

현재 앱은 하나의 엔트리포인트(`main.tsx`)로 동작하고 있다. **Server Side Rendering**을 위해서는 서버/클라이언트용 엔트리를 분리해야 한다.

## 기능 요구사항

- 서버 엔트리(`entry-server.tsx`)를 생성한다.
  - 요청 URL을 인자로 받아 해당 페이지의 HTML 문자열을 반환하는 `render` 함수를 `export`한다.
- 클라이언트 엔트리(`entry-client.tsx`)를 생성한다.
  - 기존 `main.tsx`의 역할을 대체한다.
  - 서버에서 렌더링된 HTML 위에 React를 연결한다.

## 완료 기준

- 서버 엔트리에서 `render` 함수를 호출하면 HTML 문자열이 반환된다.
- 클라이언트 엔트리에서 `hydrateRoot`를 사용하고 있다.

## 키워드

- `react-dom/server`의 `renderToString`
- `react-dom/client`의 `hydrateRoot`
- [Vite - Server-Side Rendering](https://ko.vite.dev/guide/ssr)
