# Step4. Hydration Mismatch 해결

## 문제 상황

Step3까지 진행하면 브라우저 콘솔에 Hydration Mismatch 경고가 표시될 가능성이 높다.

> **생각해보기:** 서버에서 만든 HTML과 클라이언트에서 hydration 시 만든 결과가 다르면 왜 문제가 될까? React는 왜 이 차이를 경고하는 걸까? 어떤 코드가 서버와 클라이언트에서 다른 결과를 만들 수 있을까?

## 목표

서버와 클라이언트가 동일한 초기 상태에서 동일한 HTML을 생성하도록 만들어, 모든 Hydration Mismatch 경고를 해결한다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: mismatch의 흔한 원인은 무엇일까?</summary>

- 서버에 `window`, `document` 등 브라우저 전용 API를 사용하는 코드가 있는가?
- 서버와 클라이언트에서 **초기 데이터**가 다른 상태로 렌더링되고 있는가?
- 서버에서 실행되지 않아야 하는 코드가 렌더링에 영향을 주고 있는가?

</details>

<details>
<summary>힌트 2: 서버에서 실행되면 안 되는 코드는 어떻게 분리할까?</summary>

`useEffect`는 서버에서 실행되지 않는다는 점을 활용할 수 있다. 브라우저 전용 로직은 `useEffect` 안으로 이동시키면 서버 렌더링에 영향을 주지 않는다.

</details>

<details>
<summary>힌트 3: suppressHydrationWarning은 해결책이 될까?</summary>

`suppressHydrationWarning`은 불가피한 차이(예: 타임스탬프)에 대해서만 사용해야 한다. 근본적인 데이터 불일치를 이 옵션으로 숨기면 안 된다. 원인을 찾아서 서버와 클라이언트의 초기 상태를 일치시키는 것이 올바른 해결 방법이다.

</details>

## 완료 기준

- 브라우저 콘솔에 Hydration Mismatch 관련 경고나 오류가 없다.
- 서버 응답 HTML의 내용과 브라우저에서 최종 표시되는 내용이 동일하다.

## 스스로 확인해보기

- Hydration Mismatch가 발생하면 React는 내부적으로 어떤 전략을 취하는가? 성능에 어떤 영향을 주는가?
- `typeof window !== 'undefined'` 분기를 렌더링 로직에 넣으면 어떤 문제가 생길 수 있는가?
- mismatch 오류 메시지에서 실제 원인을 찾아내는 방법은 무엇인가?

## 키워드

- React Hydration Mismatch 오류 메시지 읽는 법
- `suppressHydrationWarning`의 용도와 한계
- `useEffect`는 서버에서 실행되지 않는다
- [React - Hydration Mismatch Errors](https://ko.react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)
