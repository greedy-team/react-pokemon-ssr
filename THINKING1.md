# THINKING 1. Step 1~4 미션 이해

## 한 문장으로 정리

이번 주 미션은 기존 CSR 포켓몬 도감의 렌더링 구조를 서버와 클라이언트로 분리하고, Express가 생성한 HTML에 React를 Hydration하여 상호작용이 가능하면서 Hydration Mismatch가 없는 기본 SSR 환경을 만드는 것이다.

## 6하 원칙

### 누가(Who)

- 이 저장소를 fork한 개발자가 미션을 수행한다.
- Express 서버는 React 컴포넌트를 HTML로 렌더링한다.
- 브라우저는 서버가 전달한 HTML을 먼저 표시하고 React로 Hydration한다.
- Vite는 개발 중 서버 모듈 로딩, HTML 변환, 클라이언트 모듈 제공을 담당한다.

### 언제(When)

- 이번 주에 Step 1부터 Step 4까지 순서대로 진행한다.
- 각 Step은 이전 Step의 결과를 기반으로 하므로 엔트리포인트 분리 → 서버 구성 → Hydration → Mismatch 해결 순서를 지킨다.
- 전환 과정을 추적할 수 있도록 Step별로 커밋을 분리한다.

### 어디서(Where)

- 구현 대상은 `/ssr` 디렉터리의 React + Vite 앱이다.
- `/csr` 디렉터리는 기존 CSR 동작을 확인하기 위한 참고 자료로 사용한다.
- 서버 렌더링은 Node.js와 Express 환경에서, Hydration과 상호작용은 브라우저에서 실행된다.
- 각 Step의 요구사항과 완료 기준은 `/steps/step1-divide-entry-point.md`부터 `/steps/step4-hydration-mismatch.md`까지를 따른다.

### 무엇을(What)

- 하나였던 React 엔트리포인트를 서버용과 클라이언트용으로 분리한다.
- Express와 Vite를 연결하여 요청 URL에 맞는 React HTML을 생성하고 응답한다.
- 서버 HTML에 클라이언트 엔트리를 연결하여 카드 클릭과 페이지네이션이 동작하도록 Hydration한다.
- 서버와 클라이언트의 초기 렌더링 결과를 일치시켜 Hydration Mismatch 경고를 제거한다.

### 왜(Why)

- CSR에서는 JavaScript가 실행되기 전까지 실제 화면 콘텐츠를 만들 수 없다.
- SSR을 사용하면 서버가 먼저 HTML을 생성하여 브라우저에 전달할 수 있다.
- 서버 HTML만으로는 이벤트가 동작하지 않으므로 Hydration이 필요하다.
- 서버와 클라이언트의 첫 렌더링 결과가 다르면 React가 기존 DOM을 재사용하지 못할 수 있으므로 초기 상태를 일치시켜야 한다.

### 어떻게(How)

1. Step 1에서는 `entry-server.tsx`에서 `renderToString`으로 HTML 문자열을 반환하고, `entry-client.tsx`에서 `hydrateRoot`를 사용한다. 서버 `render` 함수의 반환값과 클라이언트 엔트리 코드를 확인한다.
2. Step 2에서는 Express에 Vite를 미들웨어 모드로 연결하고, `index.html` 템플릿에 서버 렌더링 결과를 주입한다. 서버를 실행한 뒤 `curl` 응답에 React 마크업이 포함되는지 확인한다.
3. Step 3에서는 응답 HTML에서 클라이언트 엔트리를 불러와 기존 DOM을 Hydration한다. 브라우저에서 카드 이동과 페이지네이션이 동작하고 클라이언트 모듈이 로드되는지 확인한다.
4. Step 4에서는 브라우저 전용 로직과 초기 상태 차이를 찾아 서버와 클라이언트가 같은 HTML을 만들도록 수정한다. 브라우저 콘솔에 Hydration Mismatch 경고가 없고, 서버 HTML과 최종 화면의 초기 내용이 같은지 확인한다.

## 이번 주 완료 기준

- Express 서버가 React 마크업이 포함된 HTML을 응답한다.
- 브라우저에서 포켓몬 도감 화면이 표시된다.
- Hydration 후 카드 클릭과 페이지네이션이 동작한다.
- 브라우저 콘솔에 Hydration Mismatch 관련 경고나 오류가 없다.

## 이번 주 범위가 아닌 것

서버에서 PokeAPI 데이터를 미리 가져와 실제 포켓몬 목록을 HTML에 포함하고 클라이언트에 초기 데이터로 전달하는 작업은 Step 5의 범위다. Step 1~4에서는 그 전에 필요한 SSR 실행 구조와 Hydration 흐름을 완성한다.
