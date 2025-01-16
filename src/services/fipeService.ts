import { BrandAndModelCarProps } from "@/types/BrandAndModelFipe";
import axios from "axios";

export const fetchBrandsCarsService = async () => {
  try {
    const response = await axios.get<BrandAndModelCarProps[]>(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
  }
};

export const fetchModelCarsService = async (brand: BrandAndModelCarProps) => {
  try {
    const response = await axios.get(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand.codigo}/modelos`
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
  }
};

export const fetchModelYearCarService = async (
  brand: BrandAndModelCarProps,
  model: BrandAndModelCarProps
) => {
  try {
    const response = await axios.get(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${
        brand!.codigo
      }/modelos/${model.codigo}/anos`
    );
    const responseFilter: BrandAndModelCarProps[] = response.data.filter(
      (item: BrandAndModelCarProps) => item.codigo !== "32000-1"
    );
    return responseFilter;
  } catch (error) {
    console.error("Erro ao buscar anos do modelo:", error);
  }
};

export const fetchPriceSuggetionService = async (
  brand: string,
  model: string,
  year: string
) => {
  try {
    const response = await axios.get(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos/${model}/anos/${year}`
    );

    return response.data.Valor;
  } catch (error) {
    console.error("Erro ao buscar sugestão de preço:", error);
  }
};
