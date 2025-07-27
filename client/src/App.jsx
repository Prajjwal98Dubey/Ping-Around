import "@fontsource/quicksand/700.css";
import "@fontsource/quicksand/400.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, use } from "react";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/all.context.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const HomeContainer = lazy(() => import("./pages/HomeContainer.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const MyProfile = lazy(() => import("./pages/MyProfile.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const NeighbourHood = lazy(() => import("./pages/NeighbourHood.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));
import { useAuth } from "./custom-hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
function App() {
  const { isLoading } = use(AuthContext);
  useAuth();
  if (isLoading) return <h1>Loading....</h1>;
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
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
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
