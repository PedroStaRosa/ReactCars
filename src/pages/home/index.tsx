import CardCar from "@/components/cardCarHome";
import Container from "@/components/container";
import LoadingComponent from "@/components/loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CarType } from "@/types/Car";
import { useContext, useEffect, useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Autoplay from "embla-carousel-autoplay";

import banner1 from "../../assets/banners/detailed-shot-car-wheels-tires.jpg";
import banner2 from "../../assets/banners/abla-carros-1280x640.jpg";
import banner3 from "../../assets/banners/detailed-shot-car-wheels-tires.jpg";
import banner4 from "../../assets/banners/abla-carros-1280x640.jpg";
import FiltersHome from "@/components/filtersHome";
import { CarContext } from "@/contexts/carContext";

const HomePage = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [banners] = useState([banner1, banner2, banner3, banner4]);
  const { carsContext } = useContext(CarContext);
  const plugin = useRef(Autoplay({ delay: 4000 }));

  const handleSearchCars = async () => {
    try {
      setLoading(true);
      setCars(carsContext);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchCars();
  }, [carsContext]);

  if (loading) {
    return <LoadingComponent text="Carregando..." children={<PulseLoader />} />;
  }
  return (
    <>
      <Container>
        <section
          className="
      "
        >
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {banners.map((banner, index) => (
                <CarouselItem key={index}>
                  <img
                    src={banner}
                    alt={`banner ${index}`}
                    className="rounded-lg max-h-[300px] w-full object-fill"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        <section>
          <FiltersHome />
        </section>
        {loading && (
          <LoadingComponent text="Buscando ofertas...">
            <PulseLoader color="#fff" size={20} />
          </LoadingComponent>
        )}
        {/* {!loading && cars.length == 0 && (
          <div>
            <h1 className="flex justify-center items-center p-6">
              Nenhum veículo encontrado com o filtro definido...
            </h1>
          </div>
        )} */}
        {cars.length > 0 ? (
          <section className="grid place-items-center w-full mt-4 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cars.map((car) => (
              <CardCar key={car.id} car={car} />
            ))}
          </section>
        ) : (
          <section className="flex justify-center items-center w-full mt-4">
            Nenhum veículo encontrado com o filtro
          </section>
        )}
      </Container>
    </>
  );
};

export default HomePage;
