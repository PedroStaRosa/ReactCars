import { Outlet } from "react-router-dom";
import HeaderComponent from "../header";

/* Inserir um componet Header para ser rederizado junto a todas as paginas */
const Layout = () => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <HeaderComponent />
      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
