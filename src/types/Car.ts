import { CarTypeCreate } from "./CarCreate";

export type CarType = CarTypeCreate & {
  id: string;
  sold: boolean;
  isPaused: boolean;
};
