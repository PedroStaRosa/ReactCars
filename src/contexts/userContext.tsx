import { auth } from "@/services/firebaseconnection";
import {
  createUserService,
  fecthUserService,
  LoginUserService,
  updateUserService,
} from "@/services/user.services";
import { UserType } from "@/types/User";
import { UserCredentialsType } from "@/types/UserCredentials";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  userAuth: UserType | null;
  isUserComplete: boolean;
  loadingAuth: boolean;
  loginUser: (user: UserCredentialsType) => void;
  createUser: (user: UserCredentialsType) => void;
  updateUser: (user: UserType) => void;
};

export const UserContext = createContext({} as AuthContextData);

const UserProvider = ({ children }: AuthProviderProps) => {
  const [userAuth, setUserAuth] = useState<UserType | null>(null);
  const [isUserComplete, setIsUserComplete] = useState<boolean>(true);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(() => {
    const savedSigned = localStorage.getItem("signed");
    return savedSigned ? JSON.parse(savedSigned) : false;
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoadingAuth(true);
        const fetchedUser = await fecthUserService(user);

        if (fetchedUser) {
          setUserAuth(fetchedUser);

          if (
            fetchedUser?.phone == "" ||
            fetchedUser?.state == "" ||
            fetchedUser?.city == ""
          ) {
            setIsUserComplete(false);
          }

          localStorage.setItem("signed", JSON.stringify(true));
          setSigned(() => {
            const savedSigned = localStorage.getItem("signed");
            return savedSigned ? JSON.parse(savedSigned) : false;
          });
        } /* else {
          localStorage.removeItem("signed");
          await signOut(auth);
        } */

        setLoadingAuth(false);
      } else {
        localStorage.removeItem("signed");
        setSigned(false);
        setUserAuth(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const loginUser = async (userData: UserCredentialsType) => {
    try {
      setLoadingAuth(true);

      const loginUser = await LoginUserService(userData);

      if (loginUser == "auth/invalid-credential") {
        toast.error("E-mail ou senha inválidos!");
        setLoadingAuth(false);
        return;
      }

      toast.success(loginUser);

      setLoadingAuth(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (userData: UserCredentialsType) => {
    setLoadingAuth(true);

    const createUser = await createUserService(userData);
    if (createUser == "auth/email-already-in-use") {
      toast.warning("Email já utilizado, realize o login!");
      setLoadingAuth(false);
      return;
    }

    toast.success("Usúario cadastrado com sucesso!");
    setLoadingAuth(false);
  };

  const updateUser = async (userData: UserType) => {
    setLoadingAuth(true);
    const userUpdate = await updateUserService(userData);
    if (!userUpdate) {
      toast.error("Houve um erro, tente novamente mais tarde!");
      return;
    }
    setUserAuth(userUpdate);
    setIsUserComplete(true);
    toast.success("Usúario atualizado com sucesso!");
    setLoadingAuth(false);
  };

  return (
    <UserContext.Provider
      value={{
        signed,
        userAuth,
        isUserComplete,
        loadingAuth,
        loginUser,
        createUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
