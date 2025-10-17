import { createContext, useState, useContext, useEffect } from 'react';

// Criação do contexto de autenticação (partilhado em toda a aplicação)
const AuthContext = createContext(null);

// Provider que envolve a aplicação e disponibiliza os dados de autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado com os dados do utilizador autenticado
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento inicial da app

  // Efeito que corre ao iniciar a aplicação para tentar recuperar o utilizador do localStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');

      // Se existir utilizador armazenado localmente
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser); // Parse da string JSON

        try {
          // Tenta buscar a imagem de perfil do utilizador autenticado
          const res = await fetch(
            `${process.env.REACT_APP_API_V1_AUTH_BASE_URL}users/${parsedUser.user.id}/profilePicture`,
            {
              headers: { token: parsedUser.token } // Inclui o token no cabeçalho
            }
          );

          const data = await res.json();

          // Se a resposta contiver a imagem em formato Buffer
          if (data.data?.type === 'Buffer') {
            const byteArray = new Uint8Array(data.data.data); // Converte os dados para Uint8Array
            const blob = new Blob([byteArray], { type: 'image/png' }); // Cria um Blob a partir dos bytes
            const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o blob

            // Adiciona a imagem ao utilizador
            parsedUser.profilePicture = imageUrl;
          }
        } catch (err) {
          // Em caso de erro ao obter a imagem
          console.error('Erro ao carregar imagem de perfil:', err);
        }

        // Define o utilizador no estado (com ou sem imagem)
        setUser(parsedUser);
      }

      // Termina o carregamento inicial
      setIsLoading(false);
    };

    loadUser(); // Invoca a função assíncrona
  }, []);

  // Função de login: define o utilizador e guarda no localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Função de logout: limpa o utilizador e remove do localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Fornece o contexto com os dados e funções úteis
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente nos componentes
export function useAuth() {
  return useContext(AuthContext);
}