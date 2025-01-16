import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./App.tsx";
import UserProvider from "./contexts/userContext.tsx";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CarContext, CarProvider } from "./contexts/carContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme="light"
      transition={Zoom}
    />
    <CarProvider>
      <RouterProvider router={router} />
    </CarProvider>
  </UserProvider>
);
