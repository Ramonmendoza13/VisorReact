import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage"
import InfoPage from "./pages/InfoPage"
import SearchPage from "./pages/SearchPage"
import NotFoundPage from "./pages/NotFoundPage";

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-700">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buscar/:name" element={<SearchPage />} />
        <Route path="/mostrar/:type/:name/:id" element={<InfoPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Ruta comodín */}

      </Routes>
    </div>
  )
}

export default App
