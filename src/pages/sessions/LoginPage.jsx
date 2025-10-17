import { useState } from 'react';
import { loginUser } from '../../services/api/auth';
import { useAuth } from '../../services/context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ username, password });

      if (!userData.token) {
        setError('Login inválido: token de sessão inválido ou permissões insuficientes.');
        return;
      }

      login(userData);
      setSuccess('Iniciou sessão com sucesso!');
      setError('');
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Button
        variant="outline-primary"
        className="position-absolute top-0 end-0 m-4"
        onClick={() => navigate('/register')}
      >
        Registar
      </Button>

      {/* LOGO */}
      <div className="text-center mb-4">
        <img
          src="/images/logo.png"
          alt="Scheduler Logo"
          style={{
            width: '25%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* FORMULÁRIO */}
      <Card className="border border-primary" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h4 className="text-center mb-4">Iniciar Sessão</h4>

          {/* Mensagem de sucesso vinda do reset */}
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Nome de Utilizador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escreva um nome de utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-primary"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Palavra-passe</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Escreva a palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Text className="text-muted text-end d-block">
                <Link to="/forgot-password" className="text-primary fw-medium">
                  Esqueci-me da palavra-passe
                </Link>
              </Form.Text>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-3">
              Iniciar sessão
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;