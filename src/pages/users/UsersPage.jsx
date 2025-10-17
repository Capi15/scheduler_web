import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import CustomPagination from '../../components/CustomPagination';
import { useAuth } from '../../services/context/AuthContext';
import CustomModal from '../../components/Modal';

function UsersPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_AUTH_BASE_URL;
  const { setTopbar } = useTopBar();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    birthdate: '',
    profilePicture: null
  });

  const filters = useMemo(() => ['Todos', 'Gestor', 'Administrador', 'Utilizador', 'Utilizado externo'], []);

  const roleMap = {
    Gestor: 'manager',
    Administrador: 'admin',
    Utilizador: 'user',
    'Utilizado externo': 'external'
  };

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setPassword('');
    setDeleteError('');
  };

  const handleOpenEditModal = (user) => {
    setEditData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      birthdate: user.birthdate?.split('T')[0] || '',
      profilePicture: null
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleConfirmEdit = () => {
    if (!selectedUser) return;
    const formData = new FormData();
    formData.append('email', editData.email);
    formData.append('first_name', editData.first_name);
    formData.append('last_name', editData.last_name);
    formData.append('birthdate', editData.birthdate);
    if (editData.profilePicture) {
      formData.append('profilePicture', editData.profilePicture);
    }

    fetch(`${BASE_URL}users/${selectedUser._id}`, {
      method: 'PUT',
      headers: {
        token: user?.token || ''
      },
      body: formData
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Erro ao atualizar utilizador');
        setShowEditModal(false);
        setSuccessMessage("Utilizador atualizado com sucesso!");
        setTimeout(() => setSuccessMessage(''), 4000);
      })
      .catch((err) => {
        setEditError(err.message);
      });
  };

  const deleteUser = async () => {
    if (!selectedUser || !password) return;

    try {
      const formData = new URLSearchParams();
      formData.append("username", selectedUser.username);
      formData.append("password", password);

      const response = await fetch(`${BASE_URL}users/delete`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: user?.token || ''
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Utilizador removido com sucesso!");
        setTimeout(() => setSuccessMessage(''), 4000);
        setUsers(users.filter(u => u._id !== selectedUser._id));
        handleCloseModal();
      } else {
        setDeleteError(data.message || 'Erro ao remover utilizador');
      }
    } catch (err) {
      console.error('Erro de comunicação:', err);
    }
  };

  const handleConfirmDelete = () => {
    deleteUser();
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 2000);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    setTopbar({
      title: 'Utilizadores',
      searchPlaceholder: 'Pesquisar utilizador...',
      onSearchChange: handleSearchChange,
      filters,
      activeFilter: filter,
      onFilterChange: handleFilterChange,
      buttons: [
        {
          label: 'Adicionar',
          onClick: () => console.log('Adicionar utilizador'),
          variant: 'primary'
        }
      ]
    });
  }, [setTopbar, handleSearchChange, handleFilterChange, filters, filter]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roleParam = roleMap[filter] || '';
        const searchParam = encodeURIComponent(debouncedSearch);

        const response = await fetch(
          `${BASE_URL}users?page=${currentPage}&limit=${limit}&role=${roleParam}&search=${searchParam}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: user?.token || ''
            }
          }
        );

        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Erro ao carregar utilizadores:', err);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [BASE_URL, currentPage, filter, limit, debouncedSearch, user?.token]);

  return (
    <Container className="pt-3" fluid>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <div className="border p-3 rounded" style={{ borderColor: '#b388eb', borderStyle: 'dashed', overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th><Form.Check type="checkbox" /></th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td><Form.Check type="checkbox" /></td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenEditModal(user)}>Editar</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleOpenModal(user)}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            limit={limit}
            onLimitChange={setLimit}
          />
        )}
      </div>

      {/* Modal de edição */}
      <CustomModal
        show={showEditModal}
        onPrimaryButtonClick={handleConfirmEdit}
        onSecondButtonClick={() => setShowEditModal(false)}
        title="Editar Utilizador"
        primaryButtonText="Guardar"
        secondButtonText="Cancelar"
        error={editError}
      >
        <Form.Group className="mb-2">
          <Form.Label>Nome próprio</Form.Label>
          <Form.Control
            type="text"
            value={editData.first_name}
            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Apelido</Form.Label>
          <Form.Control
            type="text"
            value={editData.last_name}
            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Data de nascimento</Form.Label>
          <Form.Control
            type="date"
            value={editData.birthdate}
            onChange={(e) => setEditData({ ...editData, birthdate: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Foto de perfil</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setEditData({ ...editData, profilePicture: e.target.files[0] })}
          />
        </Form.Group>
      </CustomModal>

      {/* Modal de remoção */}
      <CustomModal
        show={showModal}
        onPrimaryButtonClick={handleConfirmDelete}
        onSecondButtonClick={handleCloseModal}
        title="Confirmar Remoção"
        primaryButtonText="Remover"
        secondButtonText="Cancelar"
        error={deleteError}
      >
        <p>Tens a certeza que queres remover o utilizador "{selectedUser?.username}"?</p>
        <Form.Group className="mt-2">
          <Form.Label>Confirma a tua palavra-passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setDeleteError('');
            }}
          />
        </Form.Group>
      </CustomModal>
    </Container>
  );
}

export default UsersPage;