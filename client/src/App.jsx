import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import HomeContainer from "./pages/HomeContainer";
import SignUp from "./pages/SignUp";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";
import NeighbourHood from "./pages/NeighbourHood";
import Error from "./pages/Error";

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <HomeContainer />,
      },
      {
        path: "neighbourhood",
        element: <NeighbourHood />,
      },
      {
        path: "me",
        element: <MyProfile />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
