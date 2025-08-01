function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-white">
      <h1 className="text-6xl font-extrabold mb-4 text-red-400">404</h1>
      <p className="text-2xl mb-2">Página no encontrada</p>
      <a href="/" className="text-yellow-400 underline text-lg mt-4">Volver al inicio</a>
    </div>
  );
}

export default NotFoundPage; 