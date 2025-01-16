import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import Registerpage from "./pages/register";
import NewCarPage from "./pages/newCar";
import PrivateRoute from "./routes/privateRoute";
import ProfilePage from "./pages/profile";
import MycarsPage from "./pages/mycars";
import CarOverview from "./pages/carOverview";

// 404 Page Component
function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <Registerpage />,
      },
      {
        path: "/NewCar",
        element: (
          <PrivateRoute>
            <NewCarPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/mycars",
        element: (
          <PrivateRoute>
            <MycarsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/car/:id",
        element: (
          <PrivateRoute>
            <CarOverview />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
