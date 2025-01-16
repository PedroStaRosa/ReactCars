import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FiTrash, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/utils/utils";
import { create_new_offer } from "@/services/car.services";
import { UserContext } from "@/contexts/userContext";
import PulseLoader from "react-spinners/PulseLoader";
import LoadingComponent from "@/components/loading";
import { CarTypeCreate } from "@/types/CarCreate";
import { Link, useNavigate } from "react-router-dom";
import { IoAlertCircle } from "react-icons/io5";
import {
  fetchBrandsCarsService,
  fetchModelCarsService,
  fetchModelYearCarService,
  fetchPriceSuggetionService,
} from "@/services/fipeService";
import { BrandAndModelCarProps } from "@/types/BrandAndModelFipe";
import { CarContext } from "@/contexts/carContext";

interface ImagePreviewProps {
  previewUrl: string;
  name: string;
}

const optionalItens = [
  { label: "Air bag" },
  { label: "Alarme" },
  { label: "Ar Condicionado" },
  { label: "Bancos em couro" },
  { label: "Computador de bordo" },
  { label: "Central multimídia" },
  { label: "Direção Hidarulica" },
  { label: "Freio ABS" },
  { label: "Travas Elétricas" },
  { label: "Vidros Elétricos" },
  { label: "Teto solar" },
  { label: "Tração 4x4" },
];

const schemaRegisterCar = z.object({
  brand: z.string().min(1, "Informe a marca do veículo."),
  model: z.string().min(1, "Informe a modelo do veículo."),
  modelYear: z.string().min(1, "Informe o ano do veículo."),
  price: z.string().min(1, "Preço obrigátorio."),
  color: z.string().min(1, "Informe a cor do veículo."),
  km: z.string().min(1, "Informe a KM do veículo."),
  armored: z.boolean(),
  description: z.string().optional(),
  created: z.date(),
  owner: z.string(),
  uid: z.string(),
  phone: z.string(),
  optional: z
    .array(z.string())
    .optional()
    .refine(
      (value) =>
        value === undefined || value.length === 0 || value.some((item) => item),
      {
        message: "O array deve ter pelo menos um item não vazio, se fornecido.",
      }
    ),
}) satisfies z.ZodType<CarTypeCreate>;

const NewCarPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModelCar, setOpenModelCar] = useState(false);
  const [openModelYearCar, setOpenModelYearCar] = useState(false);
  const [imagesFile, setImageFiles] = useState<File[]>([]);
  const [imagesCarPreview, setImagesCarPreview] = useState<ImagePreviewProps[]>(
    []
  );
  const [brandCars, setBrandCars] = useState<BrandAndModelCarProps[]>([]);
  const [modelCars, setModelCars] = useState<BrandAndModelCarProps[]>([]);
  const [modelYearCar, setModelYearCar] = useState<BrandAndModelCarProps[]>([]);
  const [priceCarSuggestion, setPriceCarSuggestion] = useState<string>("");
  const [modelSelect, setModelSelect] = useState<BrandAndModelCarProps>();
  const [brandSelect, setBrandSelect] = useState<BrandAndModelCarProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const { userAuth, isUserComplete } = useContext(UserContext);
  const navigate = useNavigate();
  const { handleFetchCar } = useContext(CarContext);

  const form = useForm<z.infer<typeof schemaRegisterCar>>({
    resolver: zodResolver(schemaRegisterCar),
    defaultValues: {
      brand: "",
      armored: false,
      color: "",
      description: "",
      km: "",
      model: "",
      modelYear: "",
      optional: [],
      price: "",
      created: new Date(),
      owner: userAuth?.name,
      phone: userAuth?.phone,
      uid: userAuth?.uid,
    },
  });

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        toast.warn("Envie uma imagem JPEG ou PNG!");

        return;
      }
      setImageFiles((files) => [...files, file]);

      const uidImage = uuidv4();
      const newImage: ImagePreviewProps = {
        previewUrl: URL.createObjectURL(file),
        name: uidImage,
      };

      setImagesCarPreview((images) => [...images, newImage]);
    }
  };

  const handleDeleteImage = (image: ImagePreviewProps) => {
    try {
      setImagesCarPreview(
        imagesCarPreview.filter(
          (imagePreview) => imagePreview.name !== image.name
        )
      );
    } catch (error) {
      toast.error("Ocorreu um erro, tente novamente!!");
    }
  };

  const handleBrandsCars = async () => {
    const fetchBrandCars = await fetchBrandsCarsService();
    if (fetchBrandCars) {
      setBrandCars(fetchBrandCars);
    } else {
      toast.error("Erro ao marcas!!");
    }
  };

  const handleModelCar = async (brand: BrandAndModelCarProps) => {
    form.setValue("brand", brand.nome);
    form.setValue("model", "");
    form.setValue("modelYear", "");
    setPriceCarSuggestion("");
    setBrandSelect(brand);

    const fetchModelCars = await fetchModelCarsService(brand);

    if (fetchModelCars) {
      setModelCars(fetchModelCars.modelos);
    } else {
      toast.error("Erro ao buscar modelos!!");
    }
  };

  const handleModelYearCar = async (model: BrandAndModelCarProps) => {
    try {
      form.setValue("model", model.nome);
      setPriceCarSuggestion("");
      setModelSelect(model);

      const fecthModelYearCar = await fetchModelYearCarService(
        brandSelect!,
        model
      );
      if (fecthModelYearCar) {
        setModelYearCar(fecthModelYearCar);
      } else {
        toast.error("Erro ao buscar anos do modelo.");
      }
    } catch (error) {
      toast.error("Erro ao buscar anos dos modelos");
    }
  };

  const handleFetchPriceSuggetion = async (
    modelYear: BrandAndModelCarProps
  ) => {
    form.setValue("modelYear", modelYear.nome);

    const fecthPriceSuggestion = await fetchPriceSuggetionService(
      brandSelect?.codigo!,
      modelSelect?.codigo!,
      modelYear.codigo
    );

    if (fecthPriceSuggestion) {
      setPriceCarSuggestion(fecthPriceSuggestion);
    } else {
      toast.error("Erro ao buscar  sugestão de preço..");
    }
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedPriceNumber = formatNumber(event.target.value);
    form.setValue("price", formattedPriceNumber);
  };

  const handleKMChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedKmNumber = formatNumber(event.target.value);
    form.setValue("km", formattedKmNumber);
  };

  const onSubmit = async (values: z.infer<typeof schemaRegisterCar>) => {
    if (!userAuth?.uid) {
      return;
    }

    if (imagesCarPreview.length < 1) {
      toast.error("Envie pelo menos 1 foto do veículo :(");

      return;
    }
    if (values.optional?.length === 0) {
      const noOptional = confirm(
        "Nenhum opcional selecionado... opcionais ajudam a encontrar seu veículo mais facilmente.\nDeseja selecionar algum?"
      );
      if (noOptional == true) {
        return;
      }
    }
    setLoading(true);
    //REFACTOR
    // Passar pelo contexto validar os dados antes de enviar para o servico
    await create_new_offer(values, imagesFile, userAuth);
    //REFACTOR
    setImagesCarPreview([]);
    setImageFiles([]);
    form.reset();
    handleFetchCar();
    setLoading(false);
    navigate("/");
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

  useEffect(() => {
    handleBrandsCars();
  }, []);

  return (
    <Container>
      {loading && (
        <LoadingComponent text="Cadastrando">
          <PulseLoader color="#fff" size={20} />
        </LoadingComponent>
      )}
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            {!isUserComplete && (
              <div className="flex justify-center items-center w-full gap-1">
                <IoAlertCircle size={20} color="#f00" />
                <Link
                  to="/profile"
                  className="font-semibold text-red-500 text-xs"
                >
                  Complete seu perfil para anúnciar
                </Link>
              </div>
            )}
            <CardTitle>Vamos começar seu anúncio?</CardTitle>
            <CardDescription>
              Campos com asterisco (*) são obrigatórios
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center gap-2 h-[200px]">
            <div className="flex gap-2 flex-col">
              <Label>Adicione fotos*</Label>
              <div className="flex h-24 w-28 items-center justify-center rounded-lg border-2 border-logo-1 md:w-48 ">
                <div className="absolute cursor-pointer">
                  <FiUpload size={30} />
                </div>
                <div className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer opacity-0"
                    onChange={handleFile}
                  />
                </div>
              </div>
              <h1 className="text-center">
                {imagesCarPreview.length} fotos adicionadas
              </h1>
            </div>
            <div className="w-full">
              <Carousel
                className="w-full"
                setApi={setApi}
                opts={{ loop: true }}
              >
                <CarouselContent className="">
                  {imagesCarPreview.map((image) => (
                    <CarouselItem className="" key={image.name}>
                      <div className="flex w-full h-full items-center justify-center">
                        <button
                          className="absolute bg-primary p-6 rounded-full opacity-50 flex items-center justify-center"
                          onClick={() => handleDeleteImage(image)}
                        >
                          <FiTrash
                            size={28}
                            color="#fff"
                            className="absolute cursor-pointer"
                          />
                        </button>
                        <img
                          src={image.previewUrl}
                          alt="Carro"
                          className="w-full h-full min-h-28 max-h-36 bg-cover rounded-lg lg:max-w-60 lg:max-h-60"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {imagesCarPreview.length > 0 && (
                  <div className="flex items-center justify-center gap-2 w-full mt-1">
                    <Button
                      variant="link"
                      className=""
                      onClick={() => {
                        api?.scrollTo(current - 1);
                      }}
                    >
                      <FaArrowLeft />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        api?.scrollTo(current + 1);
                      }}
                    >
                      <FaArrowRight />
                    </Button>
                  </div>
                )}
              </Carousel>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" mt-4 flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Marca*</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? brandCars.find(
                                    (brand) => brand.nome === field.value
                                  )?.nome
                                : "Selecione a marca..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Marcas..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>Marca não encontrada.</CommandEmpty>
                              <CommandGroup>
                                {brandCars.map((brand) => (
                                  <CommandItem
                                    key={brand.nome}
                                    value={brand.nome}
                                    onSelect={() => {
                                      handleModelCar(brand);

                                      setOpen(false);
                                    }}
                                  >
                                    {brand.nome}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === brand.nome
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Modelo*</FormLabel>
                      <Popover
                        open={openModelCar}
                        onOpenChange={setOpenModelCar}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? modelCars.find(
                                    (model) => model.nome === field.value
                                  )?.nome
                                : "Selecione o modelo..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Modelos..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Modelo não encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {modelCars.map(
                                  (model: BrandAndModelCarProps) => (
                                    <CommandItem
                                      key={model.nome}
                                      value={model.nome}
                                      onSelect={() => {
                                        form.setValue("model", model.nome);
                                        handleModelYearCar(model);
                                        setOpenModelCar(false);
                                      }}
                                    >
                                      {model.nome}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === model.nome
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  )
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelYear"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ano*</FormLabel>
                      <Popover
                        open={openModelYearCar}
                        onOpenChange={setOpenModelYearCar}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? modelYearCar.find(
                                    (model) => model.nome === field.value
                                  )?.nome
                                : "Selecione o ano..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Anos do modelo..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Modelo não encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {modelYearCar.map((model) => (
                                  <CommandItem
                                    key={model.nome}
                                    value={model.nome}
                                    onSelect={() => {
                                      handleFetchPriceSuggetion(model);

                                      setOpenModelYearCar(false);
                                    }}
                                  >
                                    {model.nome}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === model.nome
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço* FIPE - {priceCarSuggestion}</FormLabel>
                      <FormControl className="flex">
                        <Input
                          onChange={(e) => handlePriceChange(e)}
                          placeholder="Preço do veículo..."
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-center gap-6">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="min-w-[112px]">
                            <SelectTrigger>
                              <SelectValue placeholder="Cor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ColorCar />
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="km"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilometragem*</FormLabel>
                        <FormControl>
                          <Input
                            onChange={(e) => handleKMChange(e)}
                            placeholder="KM do veículo..."
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="armored"
                  render={({ field }) => (
                    <FormItem className="flex items-baseline gap-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="">Blindado?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte-nos um pouco sobre seu carro..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <CardTitle>Opcionais do veículo</CardTitle>
                <FormField
                  control={form.control}
                  name="optional"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormDescription>
                          Selecione os opcionais do veículo.
                        </FormDescription>
                      </div>
                      <FormMessage className="mb-2" />
                      {optionalItens.map((item) => (
                        <FormField
                          key={item.label}
                          control={form.control}
                          name="optional"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.label}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={
                                      field.value?.includes(item.label) || false
                                    }
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value ?? []), item.label]
                                        : (field.value ?? []).filter(
                                            (value) => value !== item.label
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                <div className="w-full flex justify-center items-center gap-2">
                  <Button
                    variant="link"
                    className="w-1/3"
                    onClick={() => navigate("/")}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !isUserComplete}
                  >
                    Cadastrar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default NewCarPage;

const ColorCar = () => {
  return (
    <>
      <SelectItem key="1" value="AMARELO">
        Amarelo
      </SelectItem>
      <SelectItem key="2" value="AZUL">
        Azul
      </SelectItem>
      <SelectItem key="3" value="BEGE">
        Bege
      </SelectItem>
      <SelectItem key="4" value="BRANCO">
        Branco
      </SelectItem>
      <SelectItem key="5" value="CINZA">
        Cinza
      </SelectItem>
      <SelectItem key="6" value="DOURADO">
        Dourado
      </SelectItem>
      <SelectItem key="7" value="INDEFINIDA">
        Indefinida
      </SelectItem>
      <SelectItem key="8" value="LARANJA">
        Laranja
      </SelectItem>
      <SelectItem key="9" value="MARROM">
        Marrom
      </SelectItem>
      <SelectItem key="10" value="PRATA">
        Prata
      </SelectItem>
      <SelectItem key="11" value="PRETO">
        Preto
      </SelectItem>
      <SelectItem key="12" value="ROSA">
        Rosa
      </SelectItem>
      <SelectItem key="13" value="ROXO">
        Roxo
      </SelectItem>
      <SelectItem key="14" value="VERDE">
        Verde
      </SelectItem>
      <SelectItem key="15" value="VERMELHO">
        Vermelho
      </SelectItem>
      <SelectItem key="16" value="VINHO">
        Vinho
      </SelectItem>
    </>
  );
};
