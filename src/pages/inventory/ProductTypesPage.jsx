import React, { useEffect, useState, useCallback } from 'react';
import { Table, Container } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import { useAuth } from '../../services/context/AuthContext';

function ProductTypesPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_INVENTORY_BASE_URL;
  const { setTopbar } = useTopBar();
  const { user } = useAuth();

  const [productTypes, setProductTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setTopbar({
      title: 'Tipos de Produto'
    });
  }, [setTopbar]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(`${BASE_URL}productTypes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: user?.token || ''
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Erro ao carregar tipos de produto');
        }

        setProductTypes(result.data || []);
      } catch (err) {
        console.error('Erro ao carregar tipos de produto:', err);
        setError(err.message);
      }
    };

    if (user?.token) {
      fetchProductTypes();
    }
  }, [BASE_URL, user?.token]);

  return (
    <Container className="pt-3" fluid>
      <div className="border p-3 rounded" style={{ borderColor: '#b388eb', borderStyle: 'dashed' }}>
        <h5 className="mb-3">Lista de Tipos de Produto</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ overflowX: 'auto' }}>
          <Table bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productTypes.map((type) => (
                <tr key={type._id}>
                  <td>{type.name}</td>
                  <td>{type.active ? 'Ativo' : 'Inativo'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default ProductTypesPage;