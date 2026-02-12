# 포켓몬 도감 - Client Side Rendering

## 개요

이 디렉터리는 Server-Side Rendering(SSR) 전환 이전의  
Client-Side Rendering(CSR) 기반 구현입니다.

SSR 전환 과정에서 기존 동작을 비교하고 참고하기 위한 기준 구현(reference implementation)입니다.

---

## 기술 스택

- TypeScript
- [React](https://ko.react.dev/)
- [Vite](https://ko.vite.dev/)
- [PokeAPI v2](https://pokeapi.co/)

## 라우트 구조

본 구현은 브라우저에서 React가 마운트된 이후 데이터를 요청하는
전형적인 CSR 방식으로 동작합니다.

라우팅은 `react-router-dom`을 사용하여 구성되어 있으며,

- `/` : 포켓몬 목록 페이지
- `/pokemon/:id` : 포켓몬 상세 페이지
- `?page=` : 페이지네이션 처리

와 같은 구조를 가지고 있습니다.

---

## 디렉터리 구조

```
csr/
├── main.tsx      # React 애플리케이션 진입점
├── App.tsx       # 라우팅 구성
├── pages/        # 페이지 컴포넌트
├── components/   # UI 컴포넌트
└── api/          # PokeAPI 호출 로직
```

---

## 주요 구현 사항

- React Router를 사용한 클라이언트 사이드 라우팅
- `useEffect` 기반 데이터 페칭
- URL 파라미터(`useParams`, `useSearchParams`)를 활용한 동적 데이터 조회
- 페이지네이션 처리
- 포켓몬 상세 페이지 이동 기능

> [!NOTE]
> 이 구현을 기반으로 /ssr 폴더 하위에서 SSR 환경으로 전환합니다.
