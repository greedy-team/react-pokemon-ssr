import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>찾으시는 포켓몬 도감 페이지가 없습니다.</p>
      <Link to="/" className="back-link">
        ← 목록으로
      </Link>
    </div>
  );
};

export default NotFoundPage;
