import "@fontsource/quicksand/700.css";
import "@fontsource/quicksand/400.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const HomeContainer = lazy(() => import("./pages/HomeContainer.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const MyProfile = lazy(() => import("./pages/MyProfile.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const NeighbourHood = lazy(() => import("./pages/NeighbourHood.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster />
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
