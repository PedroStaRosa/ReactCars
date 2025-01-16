import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/contexts/userContext";
import { auth } from "@/services/firebaseconnection";
import { UserCredentialsType } from "@/types/UserCredentials";
import { zodResolver } from "@hookform/resolvers/zod";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import PulseLoader from "react-spinners/PulseLoader";

const schemaFormRegister = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Insira um email válido"),
    password: z.string().min(6, "A senha deve conter no minimo 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve ser igual a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não são iguais, reescreva as mesmas.",
    path: ["confirmPassword"],
  });

const Registerpage = () => {
  const { createUser, loadingAuth } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schemaFormRegister>>({
    resolver: zodResolver(schemaFormRegister),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schemaFormRegister>) => {
    // LEVAR CADASTRO PARA O CONTEXT_API !!!
    const user: UserCredentialsType = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    createUser(user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpeza do listener
  }, [auth, navigate]);

  if (loading) {
    return (
      <>
        <div className="w-full"></div>
      </>
    );
  }

  return (
    <Container>
      <main className="w-full h-full flex items-center justify-center">
        <Card className="w-4/5 ">
          <CardHeader>
            <CardTitle>Crie um conta com seu email</CardTitle>
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nome..." {...field} />
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
                          <Input placeholder="Digite seu email..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua senha..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme sua senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite a confirmção de senha..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="bg-primary p-2 rounded-lg text-center shadow-md">
                  <Label className="font-semibold text-white text-xs">
                    Apos o cadastro confira seu perfil para completa-lo.
                  </Label>
                </div>
                <div className="w-full flex justify-between gap-2">
                  <Button
                    variant="link"
                    className="w-1/3"
                    onClick={() => navigate("/")}
                  >
                    Voltar
                  </Button>
                  {!loadingAuth ? (
                    <Button type="submit" className="w-full" variant="default">
                      Cadastrar
                    </Button>
                  ) : (
                    <Button className="w-full opacity-15 flex gap-2" disabled>
                      <PulseLoader color="#ffffff" size={10} /> Cadastrando...
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </Container>
  );
};

export default Registerpage;
