# Step1. 엔트리포인트 분리

## 문제 상황

현재 앱은 하나의 엔트리포인트(`main.tsx`)로 동작하고 있다.

> **생각해보기:** 이 상태에서 서버에서도 React를 렌더링하려면 어떤 문제가 생길까? `main.tsx`를 서버에서 그대로 실행할 수 있을까?
> 있다면 왜이고, 없다면 왜일까?

## 목표

서버와 클라이언트가 각각의 역할에 맞는 엔트리포인트를 갖도록 분리한다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: 어떤 파일을 만들어야 할까?</summary>

서버용 엔트리(`entry-server.tsx`)와 클라이언트용 엔트리(`entry-client.tsx`)를 각각 만들어야 한다. 서버는 HTML 문자열을 생성하는 역할, 클라이언트는 그 HTML 위에 React를 연결하는 역할을 한다.

</details>

<details>
<summary>힌트 2: 서버 엔트리에서는 무엇을 export 해야 할까?</summary>

요청 URL을 인자로 받아 해당 페이지의 HTML 문자열을 반환하는 `render` 함수를 `export`한다. `react-dom/server`의 `renderToString`을 사용할 수 있다.

</details>

<details>
<summary>힌트 3: 클라이언트 엔트리는 기존과 뭐가 달라야 할까?</summary>

기존 `main.tsx`의 역할을 대체하되, `createRoot` 대신 `hydrateRoot`를 사용한다. 서버에서 이미 렌더링된 HTML 위에 React를 연결하는 것이기 때문이다.

</details>

## 완료 기준

- 서버 엔트리에서 `render` 함수를 호출하면 HTML 문자열이 반환된다.
- 클라이언트 엔트리에서 `hydrateRoot`를 사용하고 있다.

## 스스로 확인해보기

- `renderToString`과 `renderToStaticMarkup`의 차이는 무엇인가?
- `hydrateRoot`와 `createRoot`는 왜 구분되어 있을까? 둘 다 DOM에 React를 연결하는 건데 뭐가 다른가?

## 키워드

- `react-dom/server`의 `renderToString`
- `react-dom/client`의 `hydrateRoot`
- [Vite - Server-Side Rendering](https://ko.vite.dev/guide/ssr)
