import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";

import { MenuDropdown } from "./dropdownMenu";
import SheetLogin from "./sheetLogin";
import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import { Button } from "../ui/button";

const HeaderComponent = () => {
  const { signed } = useContext(UserContext);

  return (
    <header className="flex h-16 w-full justify-between items-center bg-primary drop-shadow">
      <div className="flex-grow flex">
        <Link to="/" className="flex items-center gap-2 justify-center p-2">
          <img alt="Logo Site" src={logo} className="w-[60px] ml-4" />
          <span className="min-[720px]:text-4xl font-bold text-white max-[320px]:text-xl min-[321px]:text-2xl">
            React
          </span>
          <span className="min-[720px]:text-5xl font-black text-hover -ml-2 max-[320px]:text-xl min-[321px]:text-3xl">
            Cars
          </span>
        </Link>
      </div>
      <div className="flex w-full justify-end items-center gap-6 mr-4">
        {/*
      refactor
       ******************************************************
       ********                      ************************
       *******   RETIRAR AO PUBLICAR **********************
       *******                        **********************
       **************************************************
       */}
        <div className="hidden sm:block">
          <a
            href="https://oasis-beluga-613.notion.site/DinoCars-Showroom-114e9acc920480f29de9fce77748d655"
            target="_blank"
          >
            <Button variant="white" className="text-xs">
              {" "}
              A IMPL.{" "}
            </Button>
          </a>
        </div>
        {/*
         ******************************************************
         **************************************************
         ******************************************************
         **************************************************
         */}
        <div className="mr-4">
          {signed && <MenuDropdown />}
          {!signed && <SheetLogin />}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
