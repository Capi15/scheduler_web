import React, { useEffect, useState, useCallback } from 'react';
import { Table, Container, Form, Button } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import { useAuth } from '../../services/context/AuthContext';
import CustomModal from '../../components/Modal';

function StocksPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_INVENTORY_BASE_URL;
  const { setTopbar } = useTopBar();
  const { user } = useAuth();

  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouses] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editProductId, setEditProductId] = useState('');
  const [editWarehouseId, setEditWarehouseId] = useState('');
  const [editError, setEditError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createProductId, setCreateProductId] = useState('');
  const [createWarehouseId, setCreateWarehouseId] = useState('');
  const [createQuantity, setCreateQuantity] = useState('');
  const [createError, setCreateError] = useState('');

  const handleCloseModals = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setSelectedStock(null);
    setDeleteError('');
    setEditError('');
  };

  const handleOpenDeleteModal = (stock) => {
    setSelectedStock(stock);
    setShowDeleteModal(true);
  };

  const handleOpenEditModal = (stock) => {
    setSelectedStock(stock);
    setEditQuantity(stock.quantity);
    setShowEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setCreateProductId('');
    setCreateWarehouseId('');
    setCreateQuantity('');
    setCreateError('');
    setShowCreateModal(true);
  };

  const handleConfirmCreate = async () => {
    try {
      const response = await fetch(`${BASE_URL}stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: user?.token || ''
        },
        body: JSON.stringify({
          product_id: createProductId,
          warehouse_id: createWarehouseId,
          quantity: Number(createQuantity)
        })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erro ao criar contagem');
      }

      setShowCreateModal(false);
      fetchStocks();
    } catch (err) {
      setCreateError(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}stocks/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          token: user?.token || ''
        },
        body: JSON.stringify({
          product_id: selectedStock.product_id,
          warehouse_id: selectedStock.warehouse_id,
        })
      });

      console.log("response", response);

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erro ao remover contagem');
      }

      handleCloseModals();
      fetchStocks();
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const response = await fetch(`${BASE_URL}stocks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: user?.token || ''
        },
        body: JSON.stringify({ product_id: editProductId, warehouse_id: editWarehouseId, quantity: editQuantity })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erro ao atualizar contagem');
      }

      handleCloseModals();
      fetchStocks();
    } catch (err) {
      setEditError(err.message);
    }
  };

  // Carrega os tipos de produto
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch(`${BASE_URL}warehouses`, {
          headers: { token: user?.token || '' }
        });
        const result = await response.json();
        setWarehouses(result.data || []);
      } catch (err) {
        console.error('Erro ao carregar os armazéns:', err);
      }
    };

    if (user?.token) {
      fetchWarehouses();
    }
  }, [BASE_URL, user?.token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}products`, {
          headers: { token: user?.token || '' }
        });
        const result = await response.json();
        setProducts(result.data || []);
      } catch (err) {
        console.error('Erro ao carregar os produtos:', err);
      }
    };

    if (user?.token) {
      fetchProducts();
    }
  }, [BASE_URL, user?.token]);

  // Carrega os produtos (com pesquisa e filtro)
  const fetchStocks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedWarehouse) params.append('warehouse_id', selectedWarehouse);

      const response = await fetch(`${BASE_URL}stocks?${params.toString()}`, {
        headers: { token: user?.token || '' }
      });

      const result = await response.json();

      // Continua mesmo que não haja produtos (sem lançar erro)
      setStocks(result.data || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err.message);
    }
  }, [BASE_URL, user?.token, selectedWarehouse]);

  // Atualiza a TopBar com filtros e botão
  useEffect(() => {
    const allFilters = ['Todos', ...warehouses.map(p => p.name)];
    const activeFilter = selectedWarehouse
      ? warehouses.find(p => p._id === selectedWarehouse)?.name
      : 'Todos';

    setTopbar({
      title: 'Contagens de stock',
      filters: allFilters,
      activeFilter,
      onFilterChange: (filterName) => {
        if (filterName === 'Todos') {
          setSelectedWarehouses('');
        } else {
          const found = warehouses.find(p => p.name === filterName);
          setSelectedWarehouses(found ? found._id : '');
        }
      },
      buttons: [
        {
          label: 'Adicionar',
          variant: 'primary',
          onClick: () => handleOpenCreateModal()
        }
      ]
    });
  }, [setTopbar, warehouses, selectedWarehouse]);

  useEffect(() => {
    if (user?.token) {
      fetchStocks();
    }
  }, [fetchStocks, user?.token]);

  const getWarehouseName = (id) => {
    return warehouses.find(w => w._id === id)?.name || '-';
  };
  const getProductName = (id) => {
    const product = products.find(p => p._id === id)?.code || '-';
    return product;
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
                <th>Nome do Produto</th>
                <th>quantidade</th>
                <th>Armazém</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                stocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{getProductName(stock.product_id)}</td>
                    <td>{stock.quantity}</td>
                    <td>{getWarehouseName(stock.warehouse_id)}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleOpenEditModal(stock)} className="me-2">Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleOpenDeleteModal(stock)}>Remover</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Modal de edição */}
      <CustomModal
        show={showEditModal}
        onPrimaryButtonClick={handleConfirmEdit}
        onSecondButtonClick={handleCloseModals}
        title="Editar Quantidade"
        primaryButtonText="Guardar"
        secondButtonText="Cancelar"
        error={editError}
      >
        <Form.Group>
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            type="number"
            value={editQuantity}
            onChange={(e) => { setEditQuantity(e.target.value); setEditProductId(selectedStock?.product_id); setEditWarehouseId(selectedStock?.warehouse_id); }}
            min={0}
          />
        </Form.Group>
      </CustomModal>

      {/* Modal de remoção */}
      <CustomModal
        show={showDeleteModal}
        onPrimaryButtonClick={handleConfirmDelete}
        onSecondButtonClick={handleCloseModals}
        title="Confirmar Remoção"
        primaryButtonText="Remover"
        secondButtonText="Cancelar"
        error={deleteError}
      >
        <p>Tens a certeza que queres remover a seguinte contagem?</p>
        <p><strong>Produto:</strong> {getProductName(selectedStock?.product_id)}</p>
        <p><strong>Armazém:</strong> {getWarehouseName(selectedStock?.warehouse_id)}</p>
      </CustomModal>
      <CustomModal
        show={showCreateModal}
        onPrimaryButtonClick={handleConfirmCreate}
        onSecondButtonClick={() => setShowCreateModal(false)}
        title="Criar Contagem"
        primaryButtonText="Criar"
        secondButtonText="Cancelar"
        error={createError}
      >
        <Form.Group className="mb-3">
          <Form.Label>Produto</Form.Label>
          <Form.Select
            value={createProductId}
            onChange={(e) => setCreateProductId(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.code}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Armazém</Form.Label>
          <Form.Select
            value={createWarehouseId}
            onChange={(e) => setCreateWarehouseId(e.target.value)}
          >
            <option value="">Selecione um armazém</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quantidade</Form.Label>
          <Form.Control
            type="number"
            value={createQuantity}
            onChange={(e) => setCreateQuantity(e.target.value)}
            min={0}
          />
        </Form.Group>
      </CustomModal>
    </Container>
  );
}

export default StocksPage;
