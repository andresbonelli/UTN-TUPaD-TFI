import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminCategorias from "./pages/AdminCategorias";
import OperativoEnfermero from "./pages/OperativoEnfermero";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/categorias"
            replace
          />
        }
      />

      <Route
        path="/categorias"
        element={<AdminCategorias />}
      />

      <Route
        path="/operativo"
        element={<OperativoEnfermero />}
      />
    </Routes>
  );
}

export default App;