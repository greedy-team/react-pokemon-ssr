import { useSearchParams } from 'react-router-dom';
import '../styles/Pagination.css';

interface Props {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: Props) => {
  const [, setSearchParams] = useSearchParams();

  const goToPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div className="pagination">
      <button
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        이전
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
