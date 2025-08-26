import { useParams } from "react-router-dom"
import HeaderComponent from "../components/HeaderComponent";
import ZonaPrivComponent from "../components/ZonaPrivComponent";
import FooterComponent from "../components/FooterComponent";



function ZonaPrivPage() {

    const { name, id, type } = useParams();

    return (
        <>
            <HeaderComponent />
            <ZonaPrivComponent />
            <FooterComponent />
        </>
    )
}

export default ZonaPrivPage