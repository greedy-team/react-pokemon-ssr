# Step 5. 서버 데이터 패칭과 클라이언트 전달

현재 포켓몬 데이터는 클라이언트에서 `useEffect`로 가져옵니다. SSR에서는 서버가 데이터를 미리 가져와서 HTML에 포함해야 합니다. 그리고 그 데이터를 클라이언트에도 전달하여 hydration 시 동일한 상태를 유지해야 합니다.

## 기능 요구사항

- 서버에서 PokeAPI를 호출하여 포켓몬 목록 데이터를 가져옵니다.
- 가져온 데이터를 React 컴포넌트에 전달하여, 포켓몬 카드 목록이 포함된 HTML을 생성합니다.
- 서버에서 가져온 데이터를 HTML에 직렬화하여 클라이언트에 전달합니다.
- 클라이언트는 전달받은 데이터를 초기 상태로 사용하여 hydration합니다.
- **서버와 클라이언트의 초기 렌더링 결과가 동일해야 합니다.**

## 완료 기준

- `curl http://localhost:PORT`의 응답 HTML에 포켓몬 이름들이 포함되어 있다.
- 브라우저에서 **JavaScript를 비활성화**해도 포켓몬 카드 목록이 표시된다.
- JavaScript가 활성화된 상태에서 hydration 후 인터랙션이 정상 동작한다.
- 브라우저 콘솔에 Hydration Mismatch 경고가 없다.

> [!NOTE]
> `PORT`는 Express 서버에서 설정한 포트 번호를 의미합니다.
> (예: `http://localhost:3000`)

## 키워드

- `window.__INITIAL_DATA__` 패턴
- JSON 직렬화 시 `</script>` 이스케이프
- `useEffect`의 서버 비실행과 초기 상태의 관계
