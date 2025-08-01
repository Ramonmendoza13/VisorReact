import InfoTvComponent from "../components/InfoTvComponent";   

import InfoMovieComponent from "../components/InfoMovieComponent";   

function InfoComponent({ title, id, type }) {
    if (type === "tv") {
        return <InfoTvComponent title={title} id={id} />;
    } else if (type === "movie") {
        return <InfoMovieComponent title={title} id={id} />;
    } else {
        return <div>Error en el tipo</div>;

    }

}

export default InfoComponent