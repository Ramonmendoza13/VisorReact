import HeaderComponent from "../components/HeaderComponent";
import MainComponent from "../components/mainComponent";
import FooterComponent from "../components/FooterComponent";

function HomePage() {
  return (
    <>
      <HeaderComponent />
      <div className="flex-1">
        <MainComponent />
      </div>
      <FooterComponent />
    </>
  )
}

export default HomePage