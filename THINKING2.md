# THINKING 2. Step 5~8 미션 이해

## 한 문장으로 정리

이번 주 미션은 서버에서 포켓몬 데이터를 가져와 HTML에 포함하고, 요청 URL에 맞는 화면을 렌더링한 뒤, 보너스로 Streaming SSR과 프로덕션 빌드까지 적용하는 것이다.

## 6하 원칙

### 누가(Who)

- 이 저장소를 fork한 개발자가 Step 5부터 Step 8까지 순서대로 구현한다.
- Express 서버는 요청 URL을 확인하고 필요한 PokeAPI 데이터를 가져온다.
- React는 서버에서 전달받은 데이터로 HTML을 만들고 브라우저에서 Hydration한다.
- Vite는 개발 환경의 모듈 로딩과 프로덕션 빌드를 담당한다.

### 언제(When)

- Step 1~4에서 기본 SSR과 Hydration 구성을 끝낸 다음 진행한다.
- Step 5에서 서버 데이터 패칭을 먼저 해결하고 Step 6에서 URL에 맞는 화면을 연결한다.
- Step 7과 Step 8은 보너스이므로 Step 5와 Step 6을 완료한 뒤 진행한다.
- 전환 과정을 확인할 수 있도록 Step별로 커밋을 나눈다.

### 어디서(Where)

- 구현 대상은 `/ssr` 디렉터리의 React + Vite + Express 앱이다.
- 서버 요청과 HTML 응답은 `server.js`에서 처리한다.
- 서버 렌더링은 `src/entry-server.tsx`, 클라이언트 Hydration은 `src/entry-client.tsx`에서 처리한다.
- 각 Step의 요구사항은 `/steps/step5-fetch-data.md`부터 `/steps/step8-bonus-production-build.md`까지를 따른다.

### 무엇을(What)

- 서버에서 PokeAPI 데이터를 가져와 포켓몬 정보가 포함된 HTML을 만든다.
- 서버에서 사용한 데이터를 클라이언트에도 전달하여 첫 렌더링 결과를 같게 만든다.
- `?page=2`와 `/pokemon/25`처럼 요청 URL에 맞는 데이터를 렌더링한다.
- 보너스로 HTML을 Streaming 방식으로 전송하고 프로덕션 빌드를 구성한다.

### 왜(Why)

- 현재 서버 HTML에는 `불러오는 중...`만 있어 SSR의 장점을 충분히 사용하지 못하고 있다.
- 서버와 클라이언트의 초기 데이터가 다르면 Hydration Mismatch가 발생할 수 있다.
- 서버가 URL을 구분하지 못하면 직접 접속한 경로와 다른 데이터가 표시될 수 있다.
- Streaming SSR은 준비된 HTML부터 보내 첫 화면을 더 빨리 보여줄 수 있다.
- 실제 배포 환경에서는 Vite 개발 서버 없이 실행할 수 있어야 한다.

### 어떻게(How)

1. Step 5에서는 서버에서 포켓몬 데이터를 가져와 React에 전달하고, 같은 데이터를 HTML에 넣어 클라이언트의 초기값으로 사용한다.
2. Step 6에서는 요청 URL과 쿼리 파라미터에 따라 목록 또는 상세 데이터를 가져오고 `StaticRouter`에 URL을 전달한다.
3. Step 7에서는 `renderToPipeableStream`과 `Suspense`를 사용하여 fallback을 먼저 보여주고 실제 내용을 이어서 전송한다.
4. Step 8에서는 클라이언트와 서버를 각각 빌드하고, 프로덕션 서버가 빌드 결과물과 정적 파일을 사용하도록 구성한다.

## 이번 주 완료 기준

- 첫 HTML 응답에 포켓몬 데이터가 포함된다.
- JavaScript를 비활성화해도 포켓몬 목록과 상세 내용이 표시된다.
- Hydration Mismatch 경고 없이 카드와 페이지네이션이 동작한다.
- 목록 페이지, 페이지네이션, 상세 페이지 직접 접속이 모두 정상 동작한다.

## 주의할 점

- 서버 데이터와 클라이언트의 초기 상태를 같게 유지한다.
- 초기 데이터를 HTML에 넣을 때 안전하게 직렬화한다.
- Step 5와 Step 6을 먼저 완료한 뒤 보너스 단계로 넘어간다.
- 캐시나 인증처럼 미션에서 요구하지 않은 기능은 추가하지 않는다.
