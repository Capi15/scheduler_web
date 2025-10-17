import { useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { forgotPassword} from '../../services/api/auth';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email });
      setSuccess('Enviámos instruções para o teu email.');
      setError('');
    } catch (err) {
      setError('Erro ao enviar pedido. Verifica o email.');
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
       <Button
          variant="outline-primary"
          className="position-absolute top-0 start-0 m-4"
          onClick={() => navigate('/')}
        >
        &larr; Voltar
      </Button>
      {/* LOGO */}
      <div className="text-center mb-4">
        <img
          src="/images/logo.png"
          alt="Scheduler Logo"
          style={{ width: '25%', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* FORMULÁRIO */}
      <Card className="border border-primary" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h4 className="text-center mb-4">Recuperar palavra-passe</h4>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email associado à conta</Form.Label>
              <Form.Control
                type="email"
                placeholder="Escreve o teu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-2">
              Enviar instruções
            </Button>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate('/')}>
                Voltar ao login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ForgotPasswordPage;
