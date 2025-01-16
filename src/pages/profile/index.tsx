import Container from "@/components/container";
import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserContext } from "@/contexts/userContext";
import { CityType } from "@/types/City";
import { UserType } from "@/types/User";
import { fetchCities, formatPhoneNumber } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { z } from "zod";

const schemaProfile = z.object({
  uid: z.string(),
  name: z.string().min(1, "nome nao pode ser alterado"),
  email: z.string().min(1, "nome nao pode ser alterado"),

  phone: z.string().regex(/^\(?\d{2}\)?[-.\s]?\d{4,5}[-.\s]?\d{4}$/, {
    message: "Formato de telefone invalido EX: (99) 99999-9999",
  }),
  state: z.string().min(1, "Selecione um estado."),
  city: z.string().min(1, "Selecione uma cidade."),
}) satisfies z.ZodType<UserType>;

const ProfilePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { userAuth, loadingAuth, updateUser } = useContext(UserContext);
  const [state, setState] = useState<string>("");
  /*   const [cities, setCities] = useState<CityType[]>([{ nome: userAuth?.city! }]); */
  const [cities, setCities] = useState<CityType[]>([]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schemaProfile>>({
    resolver: zodResolver(schemaProfile),
    defaultValues: {
      uid: userAuth?.uid,
      name: userAuth?.name,
      city: userAuth?.city,
      email: userAuth?.email,
      phone: userAuth?.phone || "",
      state: userAuth?.state,
    },
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    form.setValue("phone", formattedPhoneNumber);
  };

  const handleStateChange = (event: string) => {
    setState(event);
    form.setValue("state", event);
  };

  const handleFetchCities = async (state: string) => {
    const reponse = await fetchCities(state);
    console.log(reponse);
    setCities(reponse);
  };

  const onSubmit = async (data: z.infer<typeof schemaProfile>) => {
    try {
      setLoading(true);
      await updateUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAuth) {
      form.reset({
        uid: userAuth!.uid,
        name: userAuth!.name,
        email: userAuth!.email,
        phone: formatPhoneNumber(userAuth!.phone) || "",
        state: userAuth!.state,
        city: userAuth!.city,
      });
    }
    if (userAuth?.state) {
      setState(userAuth.state); /* MUDOU AQUI */
      handleFetchCities(userAuth.state);
    }
  }, [userAuth]);

  useEffect(() => {
    if (state) {
      handleFetchCities(state);
    }
  }, [state]);

  if (loadingAuth) {
    return (
      <LoadingComponent text="Carregando...">
        <PulseLoader />
      </LoadingComponent>
    );
  }
  return (
    <Container>
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Meu Perfil
              {/* FEATURE IN PROGRESS 
              functionality to delete account, change field " isActive " in data base for FALSE
              */}
              <Button variant="destructive">
                <FaTrash />
                <span className="hidden sm:block">Excluir conta</span>
              </Button>
              {/* FEATURE IN PROGRESS */}
            </CardTitle>
            <CardDescription>Editar</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" mt-4 flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome..."
                          {...field}
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu email..."
                          {...field}
                          disabled
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular / Whastapp</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) => handlePhoneChange(e)}
                          type="tel"
                          value={field.value}
                          maxLength={18}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full gap-3 max-[480px]:flex-col">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="max-w-[250px]">
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(e) => handleStateChange(e)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <StatesOfBrazil />
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Cidade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          // defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Cidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="">
                            {cities.map((city) => {
                              return (
                                <SelectItem
                                  key={city.nome}
                                  value={`${city.nome}`}
                                >
                                  {city.nome}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full flex justify-center items-center gap-2 mt-4">
                  <Button
                    className="w-2/4"
                    variant="link"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      "Enviando..."
                    ) : (
                      <span className="flex justify-center items-center gap-2">
                        Salvar
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </Container>
  );
};

export default ProfilePage;

const StatesOfBrazil = () => {
  return (
    <>
      <SelectItem key="AC" value="AC">
        Acre
      </SelectItem>
      <SelectItem key="AL" value="AL">
        Alagoas
      </SelectItem>
      <SelectItem key="AP" value="AP">
        Amapá
      </SelectItem>
      <SelectItem key="AM" value="AM">
        Amazonas
      </SelectItem>
      <SelectItem key="BA" value="BA">
        Bahia
      </SelectItem>
      <SelectItem key="CE" value="CE">
        Caerá
      </SelectItem>
      <SelectItem key="DF" value="DF">
        Distrito Federal
      </SelectItem>
      <SelectItem key="ES" value="ES">
        Espírito Santo
      </SelectItem>
      <SelectItem key="GO" value="GO">
        Goiás
      </SelectItem>
      <SelectItem key="MA" value="MA">
        Maranhão
      </SelectItem>
      <SelectItem key="MS" value="MS">
        Mato Grosso do Sul
      </SelectItem>
      <SelectItem key="MG" value="MG">
        Minas Gerais
      </SelectItem>
      <SelectItem key="PA" value="PA">
        Pará
      </SelectItem>
      <SelectItem key="PB" value="PB">
        Paraíba
      </SelectItem>
      <SelectItem key="PR" value="PR">
        Paraná
      </SelectItem>
      <SelectItem key="PE" value="PE">
        Pernambuco
      </SelectItem>
      <SelectItem key="PI" value="PI">
        Piauí
      </SelectItem>
      <SelectItem key="RJ" value="RJ">
        Rio de Janiero
      </SelectItem>
      <SelectItem key="RS" value="RS">
        Rio Grande do Sul
      </SelectItem>
      <SelectItem key="RO" value="RO">
        Rondônia
      </SelectItem>
      <SelectItem key="RR" value="RR">
        Roraima
      </SelectItem>
      <SelectItem key="SC" value="SC">
        Santa Catarina
      </SelectItem>
      <SelectItem key="SP" value="SP">
        São Paulo
      </SelectItem>
      <SelectItem key="SE" value="SE">
        Sergipe
      </SelectItem>
      <SelectItem key="TO" value="TO">
        Tocantins
      </SelectItem>
    </>
  );
};
