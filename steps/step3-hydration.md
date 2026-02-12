# Step 3. Hydration

서버에서 내려준 HTML은 정적 마크업입니다. 카드를 클릭해도, 페이지네이션 버튼을 눌러도 아무 일도 일어나지 않습니다. 클라이언트 JavaScript를 연결하여 인터랙션이 동작하도록 만듭니다.

## 기능 요구사항

- 서버가 응답하는 HTML에 클라이언트 엔트리 스크립트가 포함되어야 합니다.
- 브라우저에서 클라이언트 JavaScript가 로드된 후, 기존 DOM 위에 React가 연결(hydrate)되어야 합니다.
- Hydration 이후 카드 클릭, 페이지 이동 등 모든 인터랙션이 정상 동작해야 합니다.

## 완료 기준

- 페이지 로딩 후 포켓몬 카드 클릭 시 상세 페이지로 이동한다.
- 페이지네이션이 동작한다.
- 네트워크 탭에서 클라이언트 JS 번들이 로드되는 것을 확인할 수 있다.

## 키워드

- `hydrateRoot`와 `createRoot`의 차이
- Hydration이 실패하면 어떤 일이 일어나는가
- [React - hydrateRoot](https://ko.react.dev/reference/react-dom/client/hydrateRoot)
