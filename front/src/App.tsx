import { AppProviders } from './app/AppProviders'
import { AuthProvider } from './features/auth/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import './styles/global.css'

function App() {
  return <AppProviders><AuthProvider><AppRoutes /></AuthProvider></AppProviders>
}

export default App
