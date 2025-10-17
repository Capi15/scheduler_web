import React, { useEffect, useState, useCallback } from 'react';
import { Container, Card, Button, Row, Col, Badge, Form } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import { useAuth } from '../../services/context/AuthContext';
import CustomModal from '../../components/Modal';
import CustomPagination from '../../components/CustomPagination';
import Map from '../../components/Map';

function DashboardPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_REQUISITIONS_BASE_URL;
  const { setTopbar } = useTopBar();
  const { user } = useAuth();

  const [requisitions, setRequisitions] = useState([]);
  const [filter, setFilter] = useState('Pendentes');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    start_date: '',
    end_date: '',
    required_products: '',
    address: {
      street: '',
      district: '',
      municipality: '',
      locality: '',
      postal_code: '',
      country: 'Portugal',
      latitude: 41.5381,
      longitude: -8.6156
    }
  });

  const filters = ['Pendentes', 'Aprovadas', 'Rejeitadas', 'Todas'];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 2000);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchRequisitions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', limit);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filter === 'Pendentes') {
        params.append('approved', '');
      } else if (filter === 'Aprovadas') {
        params.append('approved', 'true');
      } else if (filter === 'Rejeitadas') {
        params.append('approved', 'false');
      }

      const response = await fetch(`${BASE_URL}requisitions?${params.toString()}`, {
        headers: { token: user?.token || '' }
      });

      const result = await response.json();
      setRequisitions(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar requisições:', error);
    }
  }, [BASE_URL, user?.token, debouncedSearch, filter, currentPage, limit]);

  useEffect(() => {
    if (user?.token) fetchRequisitions();
  }, [fetchRequisitions, user?.token]);

  useEffect(() => {
    setTopbar({
      title: 'Dashboard',
      searchPlaceholder: 'Pesquisar requisição...',
      onSearchChange: (value) => setSearch(value),
      filters,
      activeFilter: filter,
      onFilterChange: setFilter,
      buttons: [
        {
          label: 'Nova Requisição',
          onClick: () => setShowCreateModal(true),
          variant: 'primary'
        }
      ]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('pt-PT');

  const handleCreateRequisition = async () => {
    try {
      const payload = {
        ...formData,
        required_products: [
          {
            id: formData.required_products,
            quantity: 1
          }
        ]
      };

      const response = await fetch(`${BASE_URL}requisitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: user?.token || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao criar requisição');
      setShowCreateModal(false);
      fetchRequisitions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="pt-3" fluid>
      {requisitions.length === 0 ? (
        <div className="text-center mt-4">Nenhuma requisição encontrada.</div>
      ) : (
        <Row>
          {requisitions.map((req) => (
            <Col key={req._id} xs={12} className="mb-3">
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{req.event_name}</h5>
                  <div className="d-flex align-items-center gap-2">
                    {req.approved === true ? (
                      <Badge bg="success">Aprovada</Badge>
                    ) : req.approved === false && req.reviewed_by ? (
                      <Badge bg="danger">Rejeitada</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">Pendente</Badge>
                    )}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setSelectedReq(req)}
                    >
                      Detalhes
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Data do evento:</strong> {formatDate(req.start_date)} - {formatDate(req.end_date)}</p>
                      <p><strong>Data do pedido:</strong> {formatDate(req.submission_date)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Local:</strong> {req.address?.locality}, {req.address?.municipality}, {req.address?.district}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {totalPages > 1 && requisitions.length >= limit && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={setLimit}
        />
      )}

      {/* Modal de Detalhes */}
      <CustomModal
        show={!!selectedReq}
        onPrimaryButtonClick={() => setSelectedReq(null)}
        onSecondButtonClick={() => setSelectedReq(null)}
        title="Detalhes da Requisição"
        primaryButtonText="Fechar"
        secondButtonText=""
      >
        {selectedReq && (
          <div>
            <p><strong>Nome do Evento:</strong> {selectedReq.event_name}</p>
            <p><strong>Data de Início:</strong> {formatDate(selectedReq.start_date)}</p>
            <p><strong>Data de Fim:</strong> {formatDate(selectedReq.end_date)}</p>
            <p><strong>Distrito:</strong> {selectedReq.address?.district}</p>
            <p><strong>Conselho:</strong> {selectedReq.address?.municipality}</p>
            <p><strong>Localidade:</strong> {selectedReq.address?.locality}</p>
            <p><strong>Código Postal:</strong> {selectedReq.address?.postal_code}</p>
            <p><strong>Latitude:</strong> {selectedReq.address?.latitude}</p>
            <p><strong>Longitude:</strong> {selectedReq.address?.longitude}</p>
            <p><strong>Produtos Requisitados:</strong></p>
            <ul>
              {selectedReq.required_products?.map((prod) => (
                <li key={prod._id}>ID: {prod.id} - Quantidade: {prod.quantity}</li>
              ))}
            </ul>
          </div>
        )}
      </CustomModal>

      {/* Modal de Criação */}
      <CustomModal
        show={showCreateModal}
        onPrimaryButtonClick={handleCreateRequisition}
        onSecondButtonClick={() => setShowCreateModal(false)}
        title="Nova Requisição"
        primaryButtonText="Criar"
        secondButtonText="Cancelar"
      >
        <Form.Group className="mb-2">
          <Form.Label>Nome do Evento</Form.Label>
          <Form.Control
            value={formData.event_name}
            onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
          />
        </Form.Group>

        <Row className="mb-2">
          <Col>
            <Form.Label>Data de Início</Form.Label>
            <Form.Control
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </Col>
          <Col>
            <Form.Label>Data de Fim</Form.Label>
            <Form.Control
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>ID do Produto Requisitado</Form.Label>
          <Form.Control
            value={formData.required_products}
            onChange={(e) => setFormData({ ...formData, required_products: e.target.value })}
          />
        </Form.Group>

        <Row className="mb-2">
          <Col sm={8}>
            <Form.Label>Rua</Form.Label>
            <Form.Control
              value={formData.address.street}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
              }
            />
          </Col>
          <Col sm={4}>
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              value={formData.address.postal_code}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, postal_code: e.target.value } })
              }
            />
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <Form.Label>Distrito</Form.Label>
            <Form.Control
              value={formData.address.district}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })
              }
            />
          </Col>
          <Col>
            <Form.Label>Concelho</Form.Label>
            <Form.Control
              value={formData.address.municipality}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, municipality: e.target.value } })
              }
            />
          </Col>
          <Col>
            <Form.Label>Localidade</Form.Label>
            <Form.Control
              value={formData.address.locality}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, locality: e.target.value } })
              }
            />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Localização</Form.Label>
          <Map
            onPositionChange={(lat, lng) =>
              setFormData({
                ...formData,
                address: { ...formData.address, latitude: lat, longitude: lng }
              })
            }
            initialPosition={{
              lat: formData.address.latitude,
              lng: formData.address.longitude
            }}
          />
        </Form.Group>
      </CustomModal>
    </Container>
  );
}

export default DashboardPage;