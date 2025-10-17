import React, { useEffect, useState, useRef } from 'react';
import { Container, Form, Row, Col, Image } from 'react-bootstrap';
import { useTopBar } from '../../services/context/TopBarContext';
import { useAuth } from '../../services/context/AuthContext';
import { Toast, ToastContainer } from 'react-bootstrap';

function UserProfilePage() {
    const { user } = useAuth();
    const { setTopbar } = useTopBar();
    const fileInputRef = useRef();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birthdate: '',
    });
    const [profilePreview, setProfilePreview] = useState(user?.profilePicture || '/images/profile_picture.png');
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => {
        setTopbar({
            title: 'Perfil do Utilizador',
            buttons: [
                {
                    label: 'Atualizar',
                    variant: 'primary',
                    onClick: () => handleSubmit()
                }
            ]
        });
    }, [formData, setTopbar]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user?.user?.id && user?.token) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_V1_AUTH_BASE_URL}users/getByUsername/?username=${user.user.username}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            token: user.token
                        }
                    });
                    const result = await res.json();
                    const u = result.user;

                    setFormData({
                        first_name: u.first_name || '',
                        last_name: u.last_name || '',
                        email: u.email || '',
                        birthdate: u.birthdate?.split('T')[0] || '',
                    });
                } catch (err) {
                    console.error('Erro ao buscar detalhes do utilizador:', err);
                }
            }
        };
        fetchUserDetails();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfileImage(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const userId = user?.user?.id;
            const token = user?.token;
            const baseUrl = process.env.REACT_APP_API_V1_AUTH_BASE_URL;

            if (!userId || !token) {
                setToast({ show: true, message: 'Utilizador não autenticado.', variant: 'danger' });
                return;
            }

            const url = `${baseUrl}users/${userId}`;

            if (newProfileImage) {
                const formDataToSend = new FormData();
                formDataToSend.append('first_name', formData.first_name);
                formDataToSend.append('last_name', formData.last_name);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('birthdate', formData.birthdate);
                formDataToSend.append('profilePicture', newProfileImage);

                const res = await fetch(url, {
                    method: 'PUT',
                    headers: { token },
                    body: formDataToSend
                });

                if (!res.ok) throw new Error();
            } else {
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        token
                    },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) throw new Error();
            }

            setToast({ show: true, message: 'Dados atualizados com sucesso!', variant: 'success' });
        } catch (err) {
            console.error('Erro ao submeter atualização:', err);
            setToast({ show: true, message: 'Erro ao atualizar os dados.', variant: 'danger' });
        }
    };

    return (
        <Container className="pt-3" style={{ maxWidth: '600px' }}>
            <div className="text-center mb-4">
                <Image
                    src={profilePreview}
                    roundedCircle
                    width="160"
                    height="160"
                    alt="Foto de Perfil"
                />
                <div className="mt-2">
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />
                </div>
            </div>

            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Primeiro Nome</Form.Label>
                        <Form.Control
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Último Nome</Form.Label>
                        <Form.Control
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                        name="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Form>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    onClose={() => setToast({ ...toast, show: false })}
                    show={toast.show}
                    bg={toast.variant}
                    delay={3000}
                    autohide
                >
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default UserProfilePage;