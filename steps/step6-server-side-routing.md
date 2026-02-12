# Step 6. 서버 사이드 라우팅

사용자가 `/pokemon/25`로 직접 접속하거나, `?page=3`으로 특정 페이지에 접근했을 때, 서버가 해당 내용을 렌더링하여 응답해야 합니다.

## 기능 요구사항

- `http://localhost:PORT/pokemon/25`로 직접 접속하면, 서버가 피카츄의 상세 정보를 렌더링하여 응답합니다.
- `http://localhost:PORT?page=3`으로 직접 접속하면, 서버가 3페이지의 포켓몬 목록을 렌더링하여 응답합니다.
- 클라이언트 사이드 네비게이션(카드 클릭, 페이지네이션 버튼)도 기존과 동일하게 동작합니다.

## 완료 기준

- `curl http://localhost:PORT/pokemon/25`의 응답 HTML에 피카츄 정보가 포함되어 있다.
- `curl "http://localhost:PORT?page=2"`의 응답 HTML에 2페이지 포켓몬 목록이 포함되어 있다.
- 브라우저에서 각 URL로 **직접 접속**해도 페이지가 정상 표시된다.
- 페이지 내에서 카드 클릭이나 페이지네이션 시 전체 페이지가 새로고침되지 않는다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 키워드

- 서버에서의 URL 해석과 라우트 매칭
- React Router의 `StaticRouter` 또는 `createStaticHandler`
- Express에서 쿼리 파라미터(`req.query`) 읽기
- 서버 라우팅과 클라이언트 라우팅의 통합
