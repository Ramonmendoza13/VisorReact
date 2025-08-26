import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage"
import InfoPage from "./pages/InfoPage"
import SearchPage from "./pages/SearchPage"
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ZonaPrivPage from "./pages/zonaPrivPage";
import RegistroPage from "./pages/RegistroPage";

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-700">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zonaPrivada" element={<ZonaPrivPage />} />
        <Route path="/buscar/:name" element={<SearchPage />} />
        <Route path="/mostrar/:type/:name/:id" element={<InfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Ruta comodín */}
      </Routes>
    </div>
  )
}

export default App
