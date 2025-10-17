import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../services/context/AuthContext';
import CustomModal from '../../components/Modal';

function RolesPage() {
  const BASE_URL = process.env.REACT_APP_API_V1_AUTH_BASE_URL;
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [user?.token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}users`, {
        headers: {
          'Content-Type': 'application/json',
          token: user?.token || ''
        }
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${BASE_URL}roles`, {
        headers: {
          token: user?.token || ''
        }
      });
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (err) {
      console.error('Erro ao carregar roles:', err);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role_id || '');
    setError('');
    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', selectedUser.username);
      formData.append('role_id', selectedRoleId);

      const response = await fetch(`${BASE_URL}roles/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: user?.token || ''
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(prev =>
          prev.map(u =>
            u.username === selectedUser.username
              ? { ...u, role: roles.find(r => r._id === selectedRoleId)?.name || u.role }
              : u
          )
        );
        setSuccessMessage('Perfil atualizado com sucesso!');
        setShowModal(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setError(data.message || 'Erro ao atualizar perfil.');
      }
    } catch (err) {
      console.error('Erro ao comunicar com o servidor:', err);
      setError('Erro ao comunicar com o servidor.');
    }
  };

  return (
    <Container className="pt-3">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Nome de utilizador</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <Button size="sm" onClick={() => openModal(user)}>
                  Alterar perfil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CustomModal
        show={showModal}
        onPrimaryButtonClick={handleUpdateRole}
        onSecondButtonClick={() => setShowModal(false)}
        title="Alterar Perfil"
        primaryButtonText="Guardar"
        secondButtonText="Cancelar"
        error={error}
      >
        <p>Utilizador: <strong>{selectedUser?.username}</strong></p>
        <Form.Group>
          <Form.Label>Selecionar novo perfil</Form.Label>
          <Form.Select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            <option value="">-- Selecione um perfil --</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </CustomModal>
    </Container>
  );
}

export default RolesPage;
