import CardCarMyCars from "@/components/cardCarMyCars";
import Container from "@/components/container";
import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/contexts/userContext";
import {
  deleteCarService,
  fetchMyCarsService,
  updatePausedOrReactivateAdService,
  updateCarSellingService,
} from "@/services/car.services";
import { CarType } from "@/types/Car";
import { formattedNumber } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";

const MycarsPage = () => {
  const { userAuth } = useContext(UserContext);
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState(cars);
  const [loading, setLoading] = useState<Boolean>(true);
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState<string>("todos");
  const [valueTotal, setValueTotal] = useState<string>("");
  const handleCheckboxChange = async (filter: string) => {
    setSelectedFilter((prevFilter) => (prevFilter === filter ? "" : filter));
  };

  const calcTotalValueSold = (carList: CarType[]) => {
    // const number = parseInt(str.replace(/\./g, ""), 10);
    let totalValueSold = 0;
    carList.forEach((car) => {
      const carPrice = parseInt(car.price.toString().replace(/\./g, ""), 10);
      totalValueSold += carPrice;
    });
    const formattedValue = formattedNumber(totalValueSold);
    return formattedValue;
  };

  useEffect(() => {
    const fetchCars = async () => {
      if (userAuth) {
        setLoading(true);
        const carList = await fetchMyCarsService(userAuth.uid);
        setCars(carList);
        setLoading(false);
      }
    };

    fetchCars();
  }, [userAuth]);

  useEffect(() => {
    if (selectedFilter === "a_venda") {
      // Filtro para carros à venda
      setFilteredCars(cars.filter((car) => car.sold === false));
    } else if (selectedFilter === "vendidos") {
      // Filtro para carros vendidos
      setFilteredCars(cars.filter((car) => car.sold === true));
    } else if (selectedFilter === "todos") {
      setFilteredCars(cars);
    } else {
      // Caso nenhum filtro seja selecionado, mostra todos os carros
      setFilteredCars(cars);
    }
  }, [selectedFilter, cars]);

  useEffect(() => {
    const value = calcTotalValueSold(filteredCars);
    setValueTotal(value);
  }, [filteredCars]);

  const handleDeleteCar = async (car: CarType) => {
    try {
      if (car && userAuth) {
        await deleteCarService(car);
        const carListUpdated = await fetchMyCarsService(userAuth.uid);
        setCars(carListUpdated);
        toast.success("Veículo deletado com sucesso!");
      }
    } catch (error) {
      toast.error("Desculpe houve um erro, tente novamente mais tarde!");
    }
  };

  const handleSoldCar = async (carId: string) => {
    try {
      if (carId && userAuth) {
        const car = cars.find((car) => car.id === carId);
        if (car) {
          await updateCarSellingService(carId);
          const carListUpdated = await fetchMyCarsService(userAuth.uid);
          setCars(carListUpdated);
          toast.success("Parabéns veículo vendido com sucesso!");
        }
      }
    } catch (error) {
      toast.error("Houve uma erro, tente novamente mais tarde!");
    }
  };

  const handlePausedAd = async (carId: string) => {
    try {
      if (carId && userAuth) {
        const car = cars.find((car) => car.id === carId);
        if (car) {
          await updatePausedOrReactivateAdService(car);
          const carListUpdated = await fetchMyCarsService(userAuth.uid);
          setCars(carListUpdated);
          if (car.isPaused) {
            toast.success("Anúncio reativado com sucesso!");
          } else {
            toast.success("Anúncio pausado com sucesso!");
          }
        }
      }
    } catch (error) {
      toast.error("Houve uma erro, tente novamente mais tarde!");
    }
  };

  if (loading) {
    return (
      <LoadingComponent text="Carregando...">
        <PulseLoader />
      </LoadingComponent>
    );
  }

  return (
    <Container>
      {cars.length == 0 && (
        <section className="w-full">
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            <Label className="md:text-lg 2xl:text-5xl">
              Não há veículos cadastrados
            </Label>
            <Button className="w-2/4" onClick={() => navigate("/newcar")}>
              Cadastrar veículo
            </Button>
          </div>
        </section>
      )}
      <div className="flex gap-2">
        <div className="flex items-center space-x-1">
          <Checkbox
            checked={selectedFilter === "todos"}
            onCheckedChange={() => handleCheckboxChange("todos")}
          />
          <Label htmlFor="todos" className="text-sm">
            Todos
          </Label>
        </div>

        <div className="flex items-center space-x-1">
          <Checkbox
            checked={selectedFilter === "a_venda"}
            onCheckedChange={() => handleCheckboxChange("a_venda")}
          />
          <Label htmlFor="a_venda" className="text-sm">
            À Venda
          </Label>
        </div>

        <div className="flex items-center space-x-1">
          <Checkbox
            checked={selectedFilter === "vendidos"}
            onCheckedChange={() => handleCheckboxChange("vendidos")}
          />
          <Label htmlFor="vendidos" className="text-sm">
            Vendidos
          </Label>
        </div>
      </div>
      <Separator className="my-3" />

      <div className="flex flex-col gap-1">
        <Label>
          Total
          {selectedFilter == "a_venda"
            ? " a venda"
            : selectedFilter == "vendidos"
            ? " vendido"
            : ""}
          : {valueTotal}
        </Label>
        <Label>{filteredCars.length} veículos vendidos</Label>
      </div>

      <section className="min-[400px]:grid place-items-center w-full gap-3 mt-4 grid-cols-2">
        {filteredCars.map((car) => (
          <CardCarMyCars
            key={car.id}
            car={car}
            onDeleteCar={handleDeleteCar}
            onSoldCar={handleSoldCar}
            onPausedAd={handlePausedAd}
          />
        ))}
      </section>
    </Container>
  );
};

export default MycarsPage;
