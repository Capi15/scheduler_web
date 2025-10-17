import { createContext, useContext, useState } from 'react';

// Cria o contexto para a TopBar, que irá armazenar e partilhar dados globalmente
const TopBarContext = createContext();

/**
 * Componente que fornece o contexto da TopBar.
 * Deve envolver as partes da aplicação que precisam de mostrar ou alterar a TopBar.
 */
export function TopBarProvider({ children }) {
  // Estado global da TopBar com valores padrão
  const [topbar, setTopbar] = useState({
    title: '',                // Título da página (ex: "Utilizadores")
    searchPlaceholder: '',    // Placeholder (opcional) para a barra de pesquisa
    onSearchChange: null,     // Função chamada sempre que a pesquisa muda
    filters: [],              // Lista de filtros a mostrar como "badges" (opcional)
    activeFilter: '',         // Filtro atualmente selecionado
    onFilterChange: null,     // Função chamada quando o utilizador clica num filtro
    buttons: []               // Lista de botões opcionais (máx. 3 ou nenhum)
  });

  // Retorna o Provider, que disponibiliza o estado e a função para o atualizar
  return (
    <TopBarContext.Provider value={{ topbar, setTopbar }}>
      {children} {/* Todos os componentes filhos terão acesso ao contexto */}
    </TopBarContext.Provider>
  );
}

/**
 * função para aceder ao contexto da TopBar.
 * Pode ser usado em qualquer componente filho de TopBarProvider.
 * Semelhante a useAuth()
 */
export function useTopBar() {
  return useContext(TopBarContext);
}