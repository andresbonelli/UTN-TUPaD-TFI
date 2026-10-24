import { Route, Routes, Navigate } from "react-router-dom"; // Importar Navigate
import AdminCategorias from "./pages/AdminCategorias";

function App() {
  return (
    <Routes>
      {/* 1. Redirigir la raíz a /categorias automáticamente */}
      <Route path="/" element={<Navigate to="/categorias" replace />} />
      
      {/* 2. Tu ruta actual */}
      <Route
        path="/categorias"
        element={<AdminCategorias />}
      />
    </Routes>
  );
}

export default App;