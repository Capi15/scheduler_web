import { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { resetPassword } from '../../services/api/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (!emailParam || !tokenParam) {
      setError('Link inválido.');
    } else {
      setEmail(emailParam);
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    try {
      await resetPassword({ email, token, password });

      // Redireciona para login com mensagem de sucesso
      navigate('/', {
        state: {
          message: 'Palavra-passe alterada com sucesso. Pode iniciar sessão.'
        }
      });
    } catch (err) {
      setError('Erro ao alterar a palavra-passe: ' + err);
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

      <div className="text-center mb-4">
        <img
          src="/images/logo.png"
          alt="Scheduler Logo"
          style={{ width: '25%', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      <Card className="border border-primary" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h4 className="text-center mb-4">Alterar palavra-passe</h4>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
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
              Alterar palavra-passe
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ResetPasswordPage;