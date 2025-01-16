import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { AiOutlineClear } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { StatesOfBrazil } from "@/utils/statesOfBrasil";
import { Button } from "../ui/button";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CityType } from "@/types/City";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BrandAndModelCarProps } from "@/types/BrandAndModelFipe";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { fetchBrandsCarsService } from "@/services/fipeService";
import { CarContext } from "@/contexts/carContext";
import { Slider } from "../ui/slider";
import { formatNumber } from "@/utils/utils";

const schemaFilterHome = z.object({
  brand: z.string(),
  armored: z.boolean(),
  state: z.string(),
  city: z.string(),
  minPrice: z.string(),
  maxPrice: z.string(),
});

const FiltersHome = () => {
  const [state, setState] = useState<string | null>("");
  const [cities, setCities] = useState<CityType[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [open, setOpen] = useState(false);
  const [brandCars, setBrandCars] = useState<BrandAndModelCarProps[]>([]);
  const { handleFetchCar, handleFilters } = useContext(CarContext);

  const form = useForm<z.infer<typeof schemaFilterHome>>({
    resolver: zodResolver(schemaFilterHome),
    defaultValues: {
      brand: "",
      armored: false,
      state: "",
      city: "",
      minPrice: "",
      maxPrice: "",
    },
  });

  const handleStateChange = (event: string) => {
    setState(event);
    form.setValue("state", event);
  };

  const fetchCities = async (state: string) => {
    try {
      const response = await axios.get<CityType[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  };

  const handleClearFilters = () => {
    form.reset();
    setState("");
    setCities([]);
    handleFilters("", false, "", "", "", ""); // Reseta os filtros no contexto
    handleFetchCar(); // Busca todos os carros sem filtros
    toast.warning("Filtros limpos!");
  };

  const handleBrandsCars = async () => {
    const fetchBrandCars = await fetchBrandsCarsService();
    if (fetchBrandCars) {
      setBrandCars(fetchBrandCars);
    } else {
      toast.error("Erro ao marcas!!");
    }
  };

  const handleFormatedPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedPriceNumber = formatNumber(event.target.value);
    const field_called = event.target.name as "minPrice" | "maxPrice";
    form.setValue(field_called, formattedPriceNumber);
  };

  const onSubmit = (values: z.infer<typeof schemaFilterHome>) => {
    handleFilters(
      values.brand,
      values.armored,
      values.state,
      values.city,
      values.minPrice,
      values.maxPrice
    );
    handleFetchCar();
    setOpenSheet(!openSheet);
  };

  useEffect(() => {
    if (state) {
      fetchCities(state);
    }
  }, [state]);

  useEffect(() => {
    handleBrandsCars();
  }, []);

  return (
    <div className="flex gap-3 m-3">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button>Filtros</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Utilize os filtros para uma pesquisa mais detalhada.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 mt-3"
            >
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Marca</FormLabel>
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
                                    form.setValue("brand", brand.nome);
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
                name="armored"
                render={({ field }) => (
                  <FormItem className="flex gap-2">
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
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={(e) => handleStateChange(e)}
                      defaultValue={field.value}
                    >
                      <FormControl className="">
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-[300px]">
                        <StatesOfBrazil />
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="min-w-[112px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Cidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className={`${
                          cities.length == 0 ? "h-[50px]" : "h-[300px]"
                        }`}
                      >
                        {cities.map((city) => (
                          <SelectItem key={city.nome} value={city.nome!}>
                            {city.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        name="minPrice"
                        value={field.value}
                        onChange={(e) => {
                          handleFormatedPrice(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Máximo</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => {
                          handleFormatedPrice(e);
                        }}
                        placeholder="R$ 999.999,99"
                        name="maxPrice"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={handleClearFilters} variant="outline">
                Limpar
              </Button>
              <Button type="submit" className="w-full">
                Filtrar
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      <h3
        className="text-sm flex gap-2 justify-center items-center cursor-pointer"
        onClick={handleClearFilters}
      >
        <AiOutlineClear />
        Limpar Filtros
      </h3>
    </div>
  );
};

export default FiltersHome;
