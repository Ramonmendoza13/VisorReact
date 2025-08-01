import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom"
import HeaderComponent from "../components/HeaderComponent";
import InfoTvComponent from "../components/InfoTvComponent";
import InfoComponent from "../components/infoComponent";
import FooterComponent from "../components/FooterComponent";



function InfoPage() {

    const { name, id, type } = useParams();

    return (
        <>
            <HeaderComponent />
            <div className="flex-1 py-6">
                <InfoComponent title={name} id={id} type={type} />
            </div>
            <FooterComponent />
        </>
    )
}

export default InfoPage