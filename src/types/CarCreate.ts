import { ImageType } from "./Image";

export type CarTypeCreate = {
  brand: string;
  model: string;
  modelYear: string;
  price: number | string;
  color: string;
  km: string;
  armored: boolean;
  description?: string;
  optional?: string[];
  images?: ImageType[];
  name?: string;
  state?: string;
  city?: string;
  owner: string;
  uid: string;
  phone: string;
  created: Date;
};

// brand: z.string().min(1, "Informe a marca do veiculo"),
// model: z.string().min(1, "Informe o modelo"),
// modelYear: z.string().min(1, "Informe o ano do modelo."),
// price: z.string().min(1, "Preço obrigatório."),
// /*  manufactureYear: z.string().min(1, "Informe o ano de fabricação."), */
// /* version: z.string().min(1, "Informe a versão do veiculo."), */
// color: z.string().min(1, "Informe a cor do veiculo."),
// km: z.string().min(1),
// armored: z.boolean(),
// description: z.string().optional(),
// /* gear: z.string().min(1, ""), */
// optional: z.array(z.string()).refine((value) => value.some((item) => item)),
