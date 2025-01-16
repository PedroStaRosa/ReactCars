import { CityType } from "@/types/City";
import axios from "axios";

export const formatNumber = (value: string) => {
  if (!value) return value;

  const onlyNumbers = value.replace(/\D/g, "");

  // Converte para número e aplica formatação pt-BR
  const valueFormated = new Intl.NumberFormat("pt-BR").format(
    Number(onlyNumbers)
  );

  return valueFormated;
};

export const fetchCities = async (state: string) => {
  try {
    const response = await axios.get<CityType[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};

export const formattedNumber = (value: number) => {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return formattedValue;
};
