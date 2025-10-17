import { Pagination, Form } from 'react-bootstrap';

function CustomPagination({ currentPage, totalPages, onPageChange, limit, onLimitChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {/* Dropdown para selecionar quantos itens por página */}
      <Form.Group controlId="limitSelect" className="d-flex align-items-center mb-0">
        <Form.Label className="me-2 mb-0">Por página:</Form.Label>
        <Form.Select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          style={{ width: '100px' }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Form.Select>
      </Form.Group>

      {/* Controlo da paginação */}
      <Pagination className="mb-0">
        <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
}

export default CustomPagination;