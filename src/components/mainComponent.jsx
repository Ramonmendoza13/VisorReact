import destacados from "../data/destacados";
import MovieCard from "./MovieCard";

function MainComponent() {
  return (
    // main con altura ajustada y mejor espaciado
    <main className="p-6 py-8 mx-auto " style={{maxWidth: '1200px'}}>
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {destacados.map((peli) => (
          <MovieCard id={peli.id} title={peli.title} image={peli.image} type={peli.type}/>
        ))}
      </section>
    </main>
  );
}

export default MainComponent;
