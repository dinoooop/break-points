import React, { useEffect } from "react";
import Header from "../../blend/one/Header";
import Banner from "../../blend/one/Banner";
import Feature from "../../blend/one/Feature";
import Footer from "../../blend/one/Footer";
import { useSvStore } from "../../helpers/sv/useSvStore";

const HomePage: React.FC = () => {

  const { regular } = useSvStore();

  useEffect(() => {
    regular()
  }, [])

  return (
    <>
      <Header />
      <Banner />
      <Feature />
      <Footer />
    </>
  );
};

export default HomePage;