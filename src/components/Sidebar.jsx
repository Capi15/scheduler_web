import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    ProSidebarProvider
} from 'react-pro-sidebar';
import { FaBox, FaCalendarAlt, FaUsers, FaSignOutAlt, FaUser, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import { Image } from 'react-bootstrap';
import '../styles/index.css';

function CustomSidebar({ isOpen = false, onClose = () => { } }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const profileImg = user?.profilePicture || '/images/Profile_picture.png';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <ProSidebarProvider>
            {/* Wrapper para a sidebar e overlay */}
            <>
                {/* Overlay em mobile para fechar o menu ao clicar fora */}
                {isOpen && window.innerWidth < 1366 && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1020 }}
                        onClick={onClose}
                    />
                )}

                <div
                    className={`sidebar-wrapper ${isOpen ? 'd-block' : 'd-none'} d-lg-block`}
                    style={{
                        height: '100vh',
                        width: '250px',
                        position: 'fixed',
                        zIndex: 1030,
                        backgroundColor: '#fff',
                        borderRight: '1px solid #dee2e6',
                        overflowY: 'auto',
                    }}
                >
                    {/* Botão fechar visível apenas em mobile */}
                    <div className="d-flex justify-content-end d-lg-none p-2">
                        <button className="btn btn-light btn-sm" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* LOGO + Nome da aplicação */}
                    <div
                        className="d-flex align-items-center px-3 py-3 border-bottom"
                        style={{ backgroundColor: '#f8f9fa' }}
                    >
                        <img
                            src="/images/icon_logo.png"
                            alt="Scheduler Logo"
                            style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                marginRight: '10px'
                            }}
                        />
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Scheduler</span>
                    </div>

                    <Menu>
                        <MenuItem onClick={() => navigate('/')}>Página Inicial</MenuItem>

                        <SubMenu label="Inventário" icon={<FaBox />}>
                            <MenuItem onClick={() => navigate('/inventory/products')}>Produtos</MenuItem>
                            <MenuItem onClick={() => navigate('/inventory/stocks')}>Contagens</MenuItem>
                            <MenuItem onClick={() => navigate('/inventory/product_types')}>Tipos</MenuItem>
                        </SubMenu>

                        <SubMenu label="Eventos" icon={<FaCalendarAlt />}>
                            <MenuItem>Consultar</MenuItem>
                            <MenuItem>Tipos</MenuItem>
                            <MenuItem>Estados</MenuItem>
                        </SubMenu>

                        <SubMenu label="Utilizadores" icon={<FaUsers />}>
                            <MenuItem onClick={() => navigate('/users')}>Consultar</MenuItem>
                            <MenuItem onClick={() => navigate('/roles')}>Perfis</MenuItem>
                        </SubMenu>
                    </Menu>

                    {/* Perfil e terminar sessão */}
                    <Menu
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #ddd',
                            paddingTop: '10px',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <MenuItem
                            icon={
                                <Image
                                    src={profileImg}
                                    roundedCircle
                                    width="30"
                                    height="30"
                                    alt="Avatar"
                                />
                            }
                            onClick={() => navigate('/profile')}
                        >
                            {user?.first_name || 'Perfil'}
                        </MenuItem>
                        <div className="d-flex justify-content-center p-3">
                            <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" />
                                Terminar sessão
                            </button>
                        </div>
                    </Menu>
                </div>
            </>
        </ProSidebarProvider>
    );
}

export default CustomSidebar;