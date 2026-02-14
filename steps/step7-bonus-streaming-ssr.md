# 심화 - Streaming SSR

## 문제 상황

현재 `renderToString`은 전체 HTML이 완성될 때까지 기다렸다가 한 번에 응답한다. 데이터 패칭이 오래 걸리는 컴포넌트가 있다면, 사용자는 그 시간 동안 빈 화면을 보게 된다.

> **생각해보기:** HTML을 한 번에 다 만들어서 보내는 것과, 준비된 부분부터 조금씩 보내는 것은 사용자 경험에서 어떤 차이가 있을까?
> 데이터가 아직 준비되지 않은 영역은 어떻게 처리할 수 있을까?

## 목표

`renderToPipeableStream`을 사용하여 HTML을 점진적으로 전송하고, `<Suspense>`를 활용하여 로딩 중인 부분은 fallback을 먼저 보여준다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: renderToPipeableStream은 renderToString과 뭐가 다를까?</summary>

`renderToString`은 전체 HTML 문자열을 한 번에 반환하지만, `renderToPipeableStream`은 Node.js Stream을 반환한다. 이 Stream을 Express의 `res`에 pipe하면 HTML이 점진적으로 전송된다.

</details>

<details>
<summary>힌트 2: onShellReady와 onAllReady는 각각 언제 사용해야 할까?</summary>

`onShellReady`는 `<Suspense>` 바깥의 쉘이 준비되면 호출된다. 여기서 pipe를 시작하면 fallback이 먼저 전송되고, Suspense 내부는 나중에 스트리밍된다. `onAllReady`는 모든 콘텐츠가 준비된 후 호출된다. 크롤러용으로는 `onAllReady`, 일반 사용자용으로는 `onShellReady`가 적합하다.

</details>

## 완료 기준

- HTML이 스트리밍 방식으로 전송된다.
- `<Suspense>` fallback이 먼저 표시된 뒤, 데이터가 준비되면 실제 콘텐츠로 교체된다.

## 스스로 확인해보기

- Streaming SSR에서 Selective Hydration은 어떤 역할을 하는가?
- `onShellError`는 어떤 상황에서 발생하며, 어떻게 처리해야 하는가?
- Streaming SSR이 TTFB(Time to First Byte)에 미치는 영향은 무엇인가?

## 키워드

- [React - renderToPipeableStream](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream)
- `onShellReady` vs `onAllReady`
- Selective Hydration
