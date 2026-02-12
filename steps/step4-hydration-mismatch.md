# Step 4. Hydration Mismatch 해결

Step 3까지 진행하면 브라우저 콘솔에 Hydration Mismatch 경고가 표시될 가능성이 높습니다. 서버에서 생성한 HTML과 클라이언트가 hydration 시 계산한 결과가 다르기 때문입니다.

## 기능 요구사항

- 브라우저 콘솔에 표시되는 Hydration Mismatch 경고를 모두 해결합니다.
- 서버와 클라이언트가 동일한 초기 상태에서 동일한 HTML을 생성하도록 만듭니다.

## 확인해야 할 것

아래 항목은 mismatch의 흔한 원인입니다. 자신의 코드에서 해당하는 부분을 점검합니다.

- 서버에 `window`, `document` 등 브라우저 전용 API를 사용하는 코드가 있는가
- 서버와 클라이언트에서 **초기 데이터**가 다른 상태로 렌더링되고 있는가
- 서버에서 실행되지 않아야 하는 코드(이벤트 리스너 직접 등록, 브라우저 전용 라이브러리 등)가 렌더링에 영향을 주고 있는가

## 완료 기준

- 브라우저 콘솔에 Hydration Mismatch 관련 경고나 오류가 **없다**.
- 서버 응답 HTML의 내용과 브라우저에서 최종 표시되는 내용이 동일하다.

## 키워드

- React Hydration Mismatch 오류 메시지 읽는 법
- `suppressHydrationWarning`의 용도와 한계
- `useEffect`는 서버에서 실행되지 않는다
- [React - Hydration Mismatch Errors](https://ko.react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)
