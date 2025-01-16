import { getCars_Service } from "@/services/car.services";
import { CarType } from "@/types/Car";
import { createContext, ReactNode, useEffect, useState } from "react";

interface FiltersProps {
  brand: string | null;
  armored: boolean | null;
  state: string | null;
  city: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

interface CarContextData {
  carsContext: CarType[];
  filters: FiltersProps;
  handleFetchCar: () => void;
  handleFilters: (
    brand: any,
    armored: any,
    state: any,
    city: any,
    minPrice: any,
    maxPrice: any
  ) => void;
}

interface CarProviderProps {
  children: ReactNode;
}

export const CarContext = createContext({} as CarContextData);

export function CarProvider({ children }: CarProviderProps) {
  const [carsContext, setCarsContext] = useState<CarType[]>([]);
  const [filters, setFilters] = useState<FiltersProps>({
    brand: null,
    armored: null,
    state: null,
    city: null,
    minPrice: null,
    maxPrice: null,
  });

  const handleFilters = (
    brand: string | null = null,
    armored: boolean | null = null,
    state: string | null = null,
    city: string | null = null,
    minPrice: string | null = null,
    maxPrice: string | null = null
  ) => {
    setFilters({
      brand,
      armored,
      state,
      city,
      minPrice: Number(minPrice?.toString().replace(/\./g, "")),
      maxPrice: Number(maxPrice?.toString().replace(/\./g, "")),
    });
  };

  const handleFetchCar = async () => {
    const cars = await getCars_Service(filters);
    setCarsContext(cars);
  };

  useEffect(() => {
    handleFetchCar();
  }, [filters]);

  useEffect(() => {
    handleFetchCar();
  }, []);

  return (
    <CarContext.Provider
      value={{
        carsContext,
        filters,
        handleFetchCar,
        handleFilters,
      }}
    >
      {children}
    </CarContext.Provider>
  );
}
