# Step5. 서버 데이터 패칭과 클라이언트 전달

## 문제 상황

현재 포켓몬 데이터는 클라이언트에서 `useEffect`로 가져오고 있다. 서버에서 렌더링된 HTML에는 포켓몬 목록이 비어 있다.

> **생각해보기:** `useEffect`는 서버에서 실행되지 않는다. 그렇다면 서버 렌더링 시 데이터가 필요한 컴포넌트는 어떻게 처리해야 할까? 서버에서 가져온 데이터를 클라이언트에도 전달하지 않으면 어떤 문제가 발생할까?

## 목표

서버에서 PokeAPI 데이터를 미리 가져와 HTML에 포함하고, 그 데이터를 클라이언트에 전달하여 hydration 시 동일한 상태를 유지한다.

> [!IMPORTANT]
> 먼저 스스로 고민해본 뒤, 막히면 하나씩 열어보세요.

<details>
<summary>힌트 1: 서버에서 가져온 데이터를 컴포넌트에 어떻게 전달할까?</summary>

서버에서 PokeAPI를 호출한 뒤, 그 결과를 React 컴포넌트의 props로 전달하여 HTML을 생성한다. `render` 함수가 데이터를 인자로 받도록 수정할 수 있다.

</details>

<details>
<summary>힌트 2: 서버의 데이터를 클라이언트에 어떻게 넘길까?</summary>

서버에서 가져온 데이터를 HTML에 `<script>` 태그로 직렬화하여 심어둔다. 클라이언트는 이 데이터를 읽어 초기 상태로 사용한다. `window.__INITIAL_DATA__` 같은 전역 변수 패턴이 대표적이다.

</details>

<details>
<summary>힌트 3: JSON 직렬화 시 주의할 점은?</summary>

데이터에 `</script>` 문자열이 포함되면 HTML 파싱이 깨질 수 있다. 직렬화 시 이를 이스케이프 처리해야 한다.

</details>

## 완료 기준

- `curl http://localhost:PORT`의 응답 HTML에 포켓몬 이름들이 포함되어 있다.
- 브라우저에서 **JavaScript를 비활성화**해도 포켓몬 카드 목록이 표시된다.
- JavaScript가 활성화된 상태에서 hydration 후 인터랙션이 정상 동작한다.
- 브라우저 콘솔에 Hydration Mismatch 경고가 없다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 스스로 확인해보기

- 서버에서 데이터를 전달하지 않고 클라이언트가 다시 fetch하면 어떤 일이 일어나는가? 사용자 경험은 어떻게 달라지는가?
- `window.__INITIAL_DATA__` 패턴은 보안 관점에서 어떤 위험이 있을 수 있는가?
- 서버 데이터 전달과 hydration mismatch는 어떤 관계에 있는가?

## 키워드

- `window.__INITIAL_DATA__` 패턴
- JSON 직렬화 시 `</script>` 이스케이프
- `useEffect`의 서버 비실행과 초기 상태의 관계
