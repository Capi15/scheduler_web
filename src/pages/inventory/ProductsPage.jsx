import React, { useEffect, useState, useCallback } from 'react';
import { Table, Container } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import { useAuth } from '../../services/context/AuthContext';
import CustomPagination from '../../components/CustomPagination';

function ProductsPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_INVENTORY_BASE_URL;
  const { setTopbar } = useTopBar();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  // Carrega os tipos de produto
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(`${BASE_URL}productTypes`, {
          headers: { token: user?.token || '' }
        });
        const result = await response.json();
        setProductTypes(result.data || []);
      } catch (err) {
        console.error('Erro ao carregar tipos de produto:', err);
      }
    };

    if (user?.token) {
      fetchProductTypes();
    }
  }, [BASE_URL, user?.token]);

  // Carrega os produtos com paginação, pesquisa e filtro
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (selectedType) params.append('product_type_id', selectedType);

      const response = await fetch(`${BASE_URL}products?${params.toString()}`, {
        headers: { token: user?.token || '' }
      });

      const result = await response.json();

      // Continua mesmo que não haja produtos (sem lançar erro)
      setProducts(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err.message);
    }
  }, [BASE_URL, user?.token, search, selectedType, currentPage, limit]);

  // Atualiza a TopBar com filtros e botão
  useEffect(() => {
    const allFilters = ['Todos', ...productTypes.map(p => p.name)];
    const activeFilter = selectedType
      ? productTypes.find(p => p._id === selectedType)?.name
      : 'Todos';

    setTopbar({
      title: 'Produtos',
      searchPlaceholder: 'Pesquisar produto...',
      onSearchChange: (value) => {
        setSearch(value);
        setCurrentPage(1); // Reinicia página ao pesquisar
      },
      filters: allFilters,
      activeFilter,
      onFilterChange: (filterName) => {
        setCurrentPage(1); // Reinicia página ao filtrar
        if (filterName === 'Todos') {
          setSelectedType('');
        } else {
          const found = productTypes.find(p => p.name === filterName);
          setSelectedType(found ? found._id : '');
        }
      },
      buttons: [
        {
          label: 'Adicionar',
          variant: 'primary',
          onClick: () => console.log('Adicionar produto')
        }
      ]
    });
  }, [setTopbar, productTypes, selectedType]);

  // Chama a API ao carregar a página e sempre que a pesquisa ou filtros mudem
  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [fetchProducts, user?.token]);

  const getProductTypeName = (id) => {
    return productTypes.find(pt => pt._id === id)?.name || '-';
  };

  return (
    <Container className="pt-3" fluid>
      <div className="border p-3 rounded" style={{ borderColor: '#b388eb', borderStyle: 'dashed' }}>
        <h5 className="mb-3">Lista de Produtos</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ overflowX: 'auto' }}>
          <Table bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Tipo de Produto</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.code}</td>
                    <td>{product.description}</td>
                    <td>{getProductTypeName(product.product_type_id)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && products.length >= limit && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            limit={limit}
            onLimitChange={setLimit}
          />
        )}
      </div>
    </Container>
  );
}

export default ProductsPage;