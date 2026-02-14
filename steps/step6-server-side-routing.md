# Step 6. 서버 사이드 라우팅

## 문제 상황

현재 서버는 모든 요청에 대해 동일한 페이지를 렌더링하고 있다. 사용자가 `/pokemon/25`로 직접 접속하거나 `?page=3`으로 특정 페이지에 접근해도 서버는 이를 구분하지 못한다.

> **생각해보기:** 클라이언트 사이드 라우팅(React Router)은 브라우저에서 URL 변화를 감지하여 컴포넌트를 교체한다.
> 그런데 서버에는 브라우저가 없다. 서버에서 URL에 맞는 페이지를 렌더링하려면 라우팅을 어떻게 처리해야 할까?

## 목표

서버가 요청 URL을 해석하여 해당하는 페이지를 렌더링하고, 클라이언트 사이드 네비게이션도 기존처럼 동작하도록 만든다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: 서버에서 React Router를 어떻게 사용할까?</summary>

브라우저용 `BrowserRouter` 대신 서버에서는 `StaticRouter`를 사용한다. 요청 URL을 `StaticRouter`에 전달하면 해당 경로에 맞는 컴포넌트가 렌더링된다.

</details>

<details>
<summary>힌트 2: 쿼리 파라미터는 어떻게 처리할까?</summary>

Express에서 `req.query`로 쿼리 파라미터를 읽을 수 있다. `?page=3`이면 3페이지의 데이터를 서버에서 미리 가져와 렌더링해야 한다. URL 정보를 데이터 패칭 로직과 연결해야 한다.

</details>

<details>
<summary>힌트 3: 상세 페이지(/pokemon/:id)는 어떻게 처리할까?</summary>

Express의 라우트 파라미터나 URL 파싱으로 포켓몬 ID를 추출한 뒤, 해당 포켓몬의 데이터를 서버에서 가져와 렌더링한다. 라우트에 따라 다른 API를 호출해야 할 수 있다.

</details>

## 완료 기준

- `curl http://localhost:PORT/pokemon/25`의 응답 HTML에 피카츄 정보가 포함되어 있다.
- `curl "http://localhost:PORT?page=2"`의 응답 HTML에 2페이지 포켓몬 목록이 포함되어 있다.
- 브라우저에서 각 URL로 **직접 접속**해도 페이지가 정상 표시된다.
- 페이지 내에서 카드 클릭이나 페이지네이션 시 전체 페이지가 새로고침되지 않는다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 스스로 확인해보기

- `StaticRouter`와 `BrowserRouter`는 내부적으로 어떤 차이가 있는가?
- 서버 라우팅과 클라이언트 라우팅이 불일치하면 어떤 문제가 생기는가?
- 서버에서 404에 해당하는 URL로 요청이 오면 어떻게 처리해야 할까?

## 키워드

- 서버에서의 URL 해석과 라우트 매칭
- React Router의 `StaticRouter` 또는 `createStaticHandler`
- Express에서 쿼리 파라미터(`req.query`) 읽기
- 서버 라우팅과 클라이언트 라우팅의 통합
