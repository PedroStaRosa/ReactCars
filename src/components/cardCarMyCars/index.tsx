import { FaMapMarkedAlt, FaPause, FaPlay } from "react-icons/fa";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { CarType } from "@/types/Car";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { FaCircleCheck, FaShieldHalved } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CardCarProps {
  car: CarType;
  onDeleteCar: (car: CarType) => void;
  onSoldCar: (carId: string) => void;
  onPausedAd: (carId: string) => void;
}

const CardCarMyCars = ({
  car,
  onDeleteCar,
  onSoldCar,
  onPausedAd,
}: CardCarProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [imageLoaded, setImageLoaded] = useState<string[]>([]);
  const [isOpenDialogSoldCar, setIsOpenDialogSoldCar] =
    useState<boolean>(false);
  const [isOpenDialogDeleteCar, setIsOpenDialogDeleteCar] = useState(false);
  const [openDialogPauseSale, setOpenDialogPauseSale] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoadImage = (id: string) => {
    setImageLoaded((imageLoad) => [...imageLoad, id]);
  };

  const openDialogSolCar = () => {
    setIsOpenDialogSoldCar(true);
  };

  const handleCarSelling = async (carId: string) => {
    setLoading(true); // Start loading
    try {
      await onSoldCar(carId);
    } catch (error) {
      console.error("Error selling a car:", error);
    } finally {
      setLoading(false);
      setIsOpenDialogSoldCar(false);
    }
  };

  const handleDeleteCar = async (car: CarType) => {
    setLoading(true); // Start loading
    try {
      await onDeleteCar(car);
    } catch (error) {
      console.error("Error deleting a car:", error);
    } finally {
      setLoading(false);
      setIsOpenDialogDeleteCar(false);
    }
  };

  const handlePausedAdCar = async (carId: string) => {
    setLoading(true); // Start loading
    try {
      await onPausedAd(carId);
    } catch (error) {
      console.error("Error selling a car:", error);
    } finally {
      setLoading(false);
      setOpenDialogPauseSale(false);
    }
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
    <>
      <Card
        className="flex flex-col shadow-lg w-full h-full max-[399px]:mb-3 max-w-96"
        key={car.id}
      >
        <CardTitle className="text-center p-2 truncate">{car.model}</CardTitle>
        <Separator />

        <CardContent className="w-full flex flex-col items-center justify-between flex-1">
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            className="w-full mt-2"
          >
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
                    className="object-cover w-full h-full rounded-lg max-w-[300px]"
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
              <Label className="">{car.brand}</Label>

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
          </div>
          {!car.sold && (
            <div className=" w-full">
              <Button
                className="text-xs"
                variant="white"
                onClick={() => setIsOpenDialogDeleteCar(true)}
              >
                <RiDeleteBin6Fill size={18} />
                Excluir
              </Button>
            </div>
          )}
        </CardContent>

        <Separator />
        <CardFooter
          className={`flex items-center justify-center rounded-b-xl text-white font-semibold  ${
            car.sold ? "bg-red-500" : ""
          } ${car.isPaused ? "bg-hover" : ""}`}
        >
          {car.sold ? (
            <span className="h-11 flex justify-center items-center">
              Vendido
            </span>
          ) : !car.isPaused ? (
            <div className="flex gap-2">
              <Button
                className="text-xs my-1 bg-green-500"
                onClick={() => openDialogSolCar()}
              >
                <FaCircleCheck size={18} />
                Vender
              </Button>
              <Button
                className="text-xs my-1 bg-primary"
                onClick={() => setOpenDialogPauseSale(true)}
              >
                <FaPause size={18} />
                <span className="hidden md:block">Pausar Anúncio</span>
              </Button>
            </div>
          ) : (
            <>
              <span
                onClick={() => setOpenDialogPauseSale(true)}
                className="w-full cursor-pointer h-11 text-center flex justify-center items-center gap-3"
              >
                Pausado
                <FaPlay size={18} className="" />
              </span>
            </>
          )}
        </CardFooter>
      </Card>
      {isOpenDialogSoldCar && (
        <Dialog
          open={isOpenDialogSoldCar}
          onOpenChange={setIsOpenDialogSoldCar}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirma a venda do veículo?</DialogTitle>
              <DialogDescription>
                Após a confirmação seu anuncio será fechado.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
              <span>
                <span className="text-xs">Marca:</span> {car?.brand}
              </span>
              <span>
                <span className="text-xs">Modelo:</span>{" "}
                <strong>{car?.model}</strong>
              </span>
              <span>
                <span className="text-xs">Ano:</span> {car?.modelYear}
              </span>
              <span>
                <span className="text-xs">Valor:</span> R$ {car?.price}
              </span>
              <span>
                <span className="text-xs">Km:</span> {car?.km} KM
              </span>
            </div>

            <DialogFooter className="flex gap-2 justify-center sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="">
                  Não
                </Button>
              </DialogClose>
              <Button
                className=""
                onClick={() => handleCarSelling(car.id)}
                disabled={loading}
              >
                {loading ? "Confirmando a venda..." : "Sim"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isOpenDialogDeleteCar && (
        <Dialog
          open={isOpenDialogDeleteCar}
          onOpenChange={setIsOpenDialogDeleteCar}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deseja realmente delete seu anúncio?</DialogTitle>
              <DialogDescription className="bg-secondary-foreground text-white font-medium p-1 rounded-lg">
                Essa ação não pode ter revertida, pense com cuidado.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
              <span>
                <span className="text-xs">Marca:</span> {car?.brand}
              </span>
              <span>
                <span className="text-xs">Modelo:</span>{" "}
                <strong>{car?.model}</strong>
              </span>
              <span>
                <span className="text-xs">Ano:</span> {car?.modelYear}
              </span>
              <span>
                <span className="text-xs">Valor:</span> R$ {car?.price}
              </span>
              <span>
                <span className="text-xs">Km:</span> {car?.km} KM
              </span>
            </div>

            <DialogFooter className="flex gap-2 justify-center sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="link" className="w-full">
                  Não
                </Button>
              </DialogClose>
              <Button
                className="w-full"
                onClick={() => handleDeleteCar(car)}
                disabled={loading}
              >
                {loading ? "Deletando..." : "Sim"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {openDialogPauseSale && (
        <Dialog
          open={openDialogPauseSale}
          onOpenChange={setOpenDialogPauseSale}
        >
          <DialogContent>
            <DialogHeader>
              {car.isPaused ? (
                <DialogTitle>
                  Deseja realmente reativar seu anúncio?
                </DialogTitle>
              ) : (
                <DialogTitle>Deseja realmente pausar seu anúncio?</DialogTitle>
              )}
              {/* <DialogDescription className="bg-secondary-foreground text-white font-medium p-1 rounded-lg">
                Essa ação não pode ter revertida, pense com cuidado.
              </DialogDescription> */}
            </DialogHeader>
            <div className="flex flex-col">
              <span>
                <span className="text-xs">Marca:</span> {car?.brand}
              </span>
              <span>
                <span className="text-xs">Modelo:</span>{" "}
                <strong>{car?.model}</strong>
              </span>
              <span>
                <span className="text-xs">Ano:</span> {car?.modelYear}
              </span>
              <span>
                <span className="text-xs">Valor:</span> R$ {car?.price}
              </span>
              <span>
                <span className="text-xs">Km:</span> {car?.km} KM
              </span>
            </div>

            <DialogFooter className="flex gap-2 justify-center sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="link" className="w-full">
                  Não
                </Button>
              </DialogClose>
              <Button
                className="w-full"
                onClick={() => handlePausedAdCar(car.id)}
                disabled={loading}
              >
                {loading
                  ? car.isPaused
                    ? "Reativando"
                    : "Pausando..."
                  : "Sim"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CardCarMyCars;
