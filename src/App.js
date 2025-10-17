import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './services/context/AuthContext';
import { TopBarProvider } from './services/context/TopBarContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return <AppRoutes />;
}

export default App;