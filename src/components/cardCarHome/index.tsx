import { CarType } from "@/types/Car";
import { Card, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { FaShieldHalved } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Label } from "../ui/label";

interface CardCarProps {
  car: CarType;
}

const CardCar = ({ car }: CardCarProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [imageLoaded, setImageLoaded] = useState<string[]>([]);

  const handleLoadImage = (id: string) => {
    setImageLoaded((imageLoad) => [...imageLoad, id]);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!car) {
    return <></>;
  }
  return (
    <Card className="flex flex-col shadow-lg w-full h-full" key={car.id}>
      <CardTitle className="text-center p-2 truncate">{car.model}</CardTitle>
      <Separator />
      <CardContent className="w-full flex flex-col items-center justify-between ">
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full mt-2">
          <CarouselContent className="">
            {car.images!.map((image) => (
              <CarouselItem
                className="flex w-full h-full justify-center items-center"
                key={image.name}
              >
                <Skeleton
                  style={{
                    display: imageLoaded.includes(car.id) ? "none" : "",
                  }}
                  className="bg-muted flex items-center justify-center max-[330px]:h-14 max-[330px]:w-20 h-40 w-60"
                />
                <img
                  src={image.url}
                  alt="Carro"
                  onLoad={() => handleLoadImage(car.id)}
                  key={image.name}
                  style={{
                    display: imageLoaded.includes(car.id) ? "block" : "none",
                  }}
                  className=" object-cover w-full h-full rounded-lg max-w-[300px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="w-full mt-1 flex justify-center items-center text-xs text-muted">
            {current + 1} de {car.images?.length}
          </div>
        </Carousel>
        <div className="w-full">
          <div className="w-full flex flex-col gap-1">
            <Label>{car.brand}</Label>

            <h2 className="font-semibold max-[330px]:text-sm">
              R$ {car.price}
            </h2>

            <div className="flex flex-col gap-1">
              <span className="text-xs">{car.modelYear}</span>
              <span className="text-xs">{car.km} Km</span>
            </div>

            {car.armored ? (
              <span className="flex items-center gap-1 text-xs">
                <FaShieldHalved /> Blindado
              </span>
            ) : (
              <div className="h-4"></div>
            )}
          </div>
          <div className="w-full flex items-center justify-center mt-2">
            <Button
              className="h-8 w-full"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              Ver detalhes
            </Button>
          </div>
        </div>
      </CardContent>

      <Separator />
      <CardFooter className="flex gap-2 items-center justify-center p-2">
        <FaMapMarkedAlt />
        <span className="text-xs truncate">
          {car.city} - {car.state}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CardCar;
