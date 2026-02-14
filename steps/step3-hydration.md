# Step3. Hydration

## 문제 상황

서버에서 HTML을 내려주고 있지만, 카드를 클릭해도 페이지네이션 버튼을 눌러도 아무 일도 일어나지 않는다.

> **생각해보기:** 서버가 보내준 HTML은 왜 클릭에 반응하지 않을까? HTML만으로는 부족한 게 무엇인가? 이 정적인 HTML을 "살아있는" React 앱으로 만들려면 어떤 과정이 필요할까?

## 목표

클라이언트 JavaScript를 연결하여 서버에서 내려준 HTML 위에서 인터랙션이 동작하도록 만든다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: 클라이언트 JS는 어떻게 브라우저에 전달될까?</summary>

서버가 응답하는 HTML에 클라이언트 엔트리 스크립트(`entry-client.tsx`)를 `<script>` 태그로 포함시켜야 한다. Vite가 이 파일을 변환하여 브라우저에서 실행 가능한 형태로 제공한다.

</details>

<details>
<summary>힌트 2: 브라우저에서 JS가 로드된 후 어떤 일이 일어나야 할까?</summary>

이미 존재하는 서버 렌더링 DOM 위에 React가 연결(hydrate)되어야 한다. 새로 DOM을 그리는 게 아니라, 기존 DOM에 이벤트 핸들러를 붙이는 과정이다.

</details>

## 완료 기준

- 페이지 로딩 후 포켓몬 카드 클릭 시 상세 페이지로 이동한다.
- 페이지네이션이 동작한다.
- 네트워크 탭에서 클라이언트 JS 번들이 로드되는 것을 확인할 수 있다.

## 스스로 확인해보기

- hydration은 왜 처음부터 다시 렌더링하지 않고 기존 DOM을 "재활용"할까? 성능 외에 다른 이유도 있는가?
- 만약 hydration이 실패하면 React는 어떻게 동작하는가?
- 서버 렌더링 없이 `hydrateRoot`를 사용하면 어떤 일이 벌어질까?

## 키워드

- `hydrateRoot`와 `createRoot`의 차이
- Hydration이 실패하면 어떤 일이 일어나는가
- [React - hydrateRoot](https://ko.react.dev/reference/react-dom/client/hydrateRoot)
