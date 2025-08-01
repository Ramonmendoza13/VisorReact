import { useParams } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SearchComponent from "../components/SearchComponent";
import FooterComponent from "../components/FooterComponent";

function SearchPage() {
    const { name } = useParams();

    return (
        <>
            <HeaderComponent />
            <div className="flex-1">
                <SearchComponent searchTerm={name} />
            </div>
            <FooterComponent />
        </>
    );
}

export default SearchPage