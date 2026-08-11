import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div>
    <p className="loading">요청하신 포켓몬을 찾을 수 없어요</p>
    <Link to="/">목록으로 돌아가기</Link>
  </div>
);

export default NotFoundPage;
