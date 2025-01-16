import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/contexts/userContext";
import { auth } from "@/services/firebaseconnection";
import { signOut } from "firebase/auth";
import { useContext } from "react";

import { FaBars, FaCarAlt, FaPlusCircle, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

export function MenuDropdown() {
  const { userAuth, loadingAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="max-w-32" variant="white">
            <span className="hidden sm:block truncate">
              {loadingAuth ? (
                <PulseLoader size={5} color="#fa6c00" />
              ) : (
                userAuth?.name
              )}
            </span>
            <FaBars className="block sm:hidden h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white">
          <DropdownMenuLabel className="block sm:hidden truncate">
            {userAuth?.name}
          </DropdownMenuLabel>
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                navigate("/profile");
              }}
            >
              <FaUser className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Meus Carros</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                navigate("/newCar");
              }}
            >
              <FaPlusCircle className="mr-2 h-4 w-4" />
              Novo Carro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/mycars");
              }}
            >
              <FaCarAlt className="mr-2 h-4 w-4" />
              Cadastrados
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FiLogOut className="mr-2 h-4 w-4" />
            <span
              onClick={() => {
                handleLogout();
              }}
            >
              Log out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
