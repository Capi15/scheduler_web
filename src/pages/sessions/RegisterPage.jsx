import { useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { registerUser } from '../../services/api/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    try {
      const userData = await registerUser({ username, password });

      setSuccess('Registo efetuado com sucesso!');
      setUsername('');
      setPassword('');
      setConfirm('');
      setError('');
    } catch (err) {
      setError('Erro ao registar o utilizador: ' + err);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Button
        variant="outline-primary"
        className="position-absolute top-0 end-0 m-4"
        onClick={() => navigate('/')}
      >
        Iniciar Sessão &rarr;
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
          <h4 className="text-center mb-4">Registar</h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome de Utilizador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escreva um nome de utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-primary"
                required
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
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirmar palavra-passe</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repita a palavra-passe"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="border-primary"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-3">
              Registar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;

