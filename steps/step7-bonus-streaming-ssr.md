# 심화 - Streaming SSR

`renderToString` 대신 `renderToPipeableStream`을 사용하여 스트리밍 SSR을 구현합니다.

- HTML을 한 번에 완성하여 보내는 대신, 점진적으로 전송합니다.
- `<Suspense>` 경계를 활용하여 데이터 로딩 중인 부분은 fallback을 먼저 보여줍니다.
- `onShellReady`와 `onAllReady`의 차이를 이해하고 적절한 시점에 응답을 시작합니다.

## 키워드

- [React - renderToPipeableStream](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream)
- `onShellReady` vs `onAllReady`
- Selective Hydration
