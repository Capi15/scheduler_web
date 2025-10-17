import { useState } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';

// Componente TopBar reutilizável com título, pesquisa, filtros e botões
function TopBar({
    title,               // Título da página
    searchPlaceholder,   // Placeholder (opcional) para a barra de pesquisa
    onSearchChange,      // Função chamada sempre que a pesquisa muda
    filters = [],        // Lista de filtros a mostrar como "badges" (opcional)
    activeFilter,        // Filtro atualmente selecionado
    onFilterChange,      // Função chamada quando o utilizador clica num filtro
    buttons = [],        // Lista de botões opcionais (máx. 3 ou nenhum)
    onToggleSidebar,     // Função para abrir a sidebar (hambúrguer)
    sidebarOpen,          // Indica se a sidebar está visível
    isDesktop = false
}) {
    const [searchValue, setSearchValue] = useState(''); // Estado local da pesquisa

    // Função chamada quando o utilizador escreve um caratere na barra de pesquisa
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);                    // Atualiza valor local
        if (onSearchChange) onSearchChange(value); // Atualiza o valor do componente pai
    };

    return (
        <div className={`topbar ${sidebarOpen && isDesktop ? 'with-sidebar' : 'no-sidebar'}`}>
            <Container fluid>
                {/* Linha com o título da página e botão de menu hamburguer em ecrãs pequenos */}
                <Row className="align-items-center mb-2">
                    {/* Botão hambúrguer só visível quando a sidebar está oculta */}
                    {!sidebarOpen && (
                        <Col xs="auto">
                            <Button
                                variant="outline-secondary"
                                onClick={onToggleSidebar}
                                style={{ fontSize: '1.2rem', padding: '0.3rem 0.75rem' }}
                            >
                                ☰
                            </Button>
                        </Col>
                    )}
                    <Col>
                        <h5 className="mb-0">{title}</h5>
                    </Col>
                </Row>

                {/* Barra de pesquisa e botões à direita */}
                {(onSearchChange || buttons.length > 0) && (
                    <Row className="align-items-center mb-3">
                        {/* Barra de pesquisa */}
                        <Col md={6}>
                            {onSearchChange && (
                                <Form.Control
                                    type="text"
                                    placeholder={searchPlaceholder || 'Pesquisar...'}
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                            )}
                        </Col>

                        {/* Botões de ação (máximo 3, ou nenhum, default = 1) */}
                        <Col md={6} className="d-flex justify-content-end gap-2 mt-2 mt-md-0">
                            {buttons.slice(0, 3).map((btn, idx) => (
                                <Button
                                    key={idx}
                                    variant={btn.variant || 'secondary'}
                                    onClick={btn.onClick}
                                >
                                    {btn.label}
                                </Button>
                            ))}
                        </Col>
                    </Row>
                )}

                {/* Linha com os filtros (usa badges) */}
                {filters.length > 0 && (
                    <Row>
                        <Col>
                            <div
                                className="filter-scroll-wrapper"
                                style={{
                                    overflowX: 'auto',
                                    whiteSpace: 'nowrap',
                                    WebkitOverflowScrolling: 'touch',
                                    paddingBottom: '0.5rem'
                                }}
                            >
                                {filters.map((filter, index) => (
                                    <Badge
                                        key={index}
                                        bg={filter === activeFilter ? 'primary' : 'light'}
                                        text={filter === activeFilter ? 'light' : 'dark'}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.9rem',
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap',
                                            marginRight: '0.5rem'
                                        }}
                                        onClick={() => onFilterChange && onFilterChange(filter)}
                                    >
                                        {filter}
                                    </Badge>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default TopBar;