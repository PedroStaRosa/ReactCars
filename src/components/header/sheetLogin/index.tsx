import logoGmail from "../../../assets/gmailLogo.webp";

import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "../../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import { UserCredentialsType } from "@/types/UserCredentials";
import PulseLoader from "react-spinners/PulseLoader";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Insira um email válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const SheetLogin = () => {
  const [open, setOpen] = useState(false);
  const { loginUser, loadingAuth } = useContext(UserContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const user: UserCredentialsType = {
      email: values.email,
      password: values.password,
    };
    loginUser(user);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="bg-white text-primary shadow rounded-md p-2 hover:bg-orange-500 hover:text-white">
          Entrar
        </SheetTrigger>
        <SheetContent>
          <Card>
            <CardHeader>
              <CardTitle>Entre com sua conta</CardTitle>
              <CardDescription>
                Utilize seu email e senha ou o Gmail para entrar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu email.."
                              {...field}
                            />
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
                  </div>
                  {loadingAuth ? (
                    <Button
                      variant="default"
                      disabled
                      className="w-full flex gap-2"
                    >
                      <PulseLoader color="#ffffff" size={10} /> Entrando...
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full" variant="default">
                      Entrar
                    </Button>
                  )}
                </form>
              </Form>
              <div className="mt-3 flex items-center gap-1 justify-between">
                <Separator className="w-2/6" />
                <span> ou </span>
                <Separator className="w-2/6" />
              </div>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-3 mt-4"
              >
                <img src={logoGmail} alt="logo Gmail" className="w-6" />
                Entrar com gmail
              </Button>
            </CardContent>
          </Card>
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <h2>Não tem uma conta?</h2>

            <Link
              to="/register"
              className="font-bold text-primary text-sm "
              onClick={() => setOpen(false)}
            >
              Crie sua conta
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SheetLogin;
