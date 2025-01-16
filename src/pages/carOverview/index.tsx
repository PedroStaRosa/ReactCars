import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCarOverviewService } from "@/services/car.services";
import { CarType } from "@/types/Car";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

const CarOverview = () => {
  const { id } = useParams();
  const [carOverview, setCarOverview] = useState<CarType | null>();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [imageLoaded, setImageLoaded] = useState<string[]>([]);

  const handleLoadImage = (id: string) => {
    setImageLoaded((imageLoad) => [...imageLoad, id]);
  };
  const navigate = useNavigate();

  const fetchCarOverview = async () => {
    if (id) {
      const car = await getCarOverviewService(id);
      if (car) {
        setCarOverview(car);
        return;
      }
      navigate("/");
      return toast.warn("Carro não encontrado!");
    }
  };

  useEffect(() => {
    fetchCarOverview();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Container>
      <section>
        <Card>
          <CardContent>
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: "start" }}
              className="w-full mt-2 "
            >
              <CarouselContent className="">
                {carOverview?.images!.map((image) => (
                  <CarouselItem
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 flex justify-center items-center"
                    key={image.name}
                  >
                    <Skeleton
                      style={{
                        display: imageLoaded.includes(carOverview.id)
                          ? "none"
                          : "",
                      }}
                      className="bg-muted flex items-center justify-center max-[330px]:h-14 max-[330px]:w-20 h-40 w-60"
                    />
                    <img
                      src={image.url}
                      alt="Carro"
                      onLoad={() => handleLoadImage(carOverview.id)}
                      key={image.name}
                      style={{
                        display: imageLoaded.includes(carOverview.id)
                          ? "block"
                          : "none",
                      }}
                      className=" object-cover w-full h-full rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="w-full mt-1 flex justify-center items-center text-xs text-muted">
                {current + 1} de {carOverview?.images!.length}
              </div>
            </Carousel>
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader className="p-0 mt-3 ml-6">
            <CardTitle className="">{carOverview?.model}</CardTitle>
            <CardDescription className="font-semibold text-base">
              {carOverview?.brand}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col w-full">
            <div className="w-full flex flex-col p-2">
              <Separator />
              <h2 className="font-semibold text-foreground text-3xl mt-2">
                R$ {carOverview?.price}
              </h2>
              <div className="w-full flex mt-3">
                {/* ESQUERDA */}
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <Label>Ano</Label>
                    <span className="font-bold">{carOverview?.modelYear}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Cor</Label>
                    <span className="font-bold">{carOverview?.color}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="">Blindado</Label>
                    {carOverview?.armored ? (
                      <h3 className="font-bold">Sim</h3>
                    ) : (
                      <h3 className="font-bold">Não</h3>
                    )}
                  </div>
                </div>
                {/* DIREITA */}
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <Label>KM</Label>
                    <span className="font-bold">{carOverview?.km} Km</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Local</Label>
                    <h3 className="font-bold">
                      {carOverview?.city} - {carOverview?.state}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Separator />
              <CardTitle className="py-2 text-lg">Itens do veículo</CardTitle>
              <div className="grid grid-cols-2 ">
                {carOverview?.optional!.map((opt) => (
                  <h3 key={opt} className="mb-2">
                    {opt}
                  </h3>
                ))}
              </div>
            </div>
            <div className="p-2">
              <CardTitle className=" text-lg">Sobre o veículo</CardTitle>
              <p>{carOverview?.description}</p>
            </div>

            <div className="w-full mt-2">
              <div className="flex w-full flex-col gap-2 p-2">
                <div>
                  <CardTitle className="text-lg">Vendedor</CardTitle>
                  <p>{carOverview?.owner}</p>
                </div>
                <div className=" flex gap-2">
                  <span>Anunciado em:</span>
                  <span>
                    {/* Aponta erro, mas funciona, pois o campo vem em timestamp e é convertido para data!! */}
                    {moment(carOverview?.created.toDate()).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=${carOverview?.phone}&text=Olá ${carOverview?.owner}, vi esse(a) ${carOverview?.model} no site ReactCars e fiquei interresado!`}
                target="_blank"
              >
                <Button className="w-full flex gap-2 p-5">
                  <FaWhatsapp size={24} />
                  Entrar em contato
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </Container>
  );
};

export default CarOverview;
