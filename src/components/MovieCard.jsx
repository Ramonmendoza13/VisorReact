import { Link } from "react-router-dom";

function MovieCard({ title, image, id, type }) {
  return (
    <Link
      to={`/mostrar/${type}/${encodeURIComponent(title)}/${id}`}
      className="
        flex flex-col items-center
        transition duration-200
        hover:bg-gray-600
        hover:scale-105
        cursor-pointer
        rounded-2xl
        p-2
      "
    >
      <img
        src={image}
        alt={title}
        className="w-full rounded-2xl object-cover aspect-[2/3] mb-2"
        style={{ maxWidth: '220px' }}
      />
      <h2 className="text-xl font-bold text-cyan-400 text-center mt-2">{title}</h2>
    </Link>
  );
}

export default MovieCard;
