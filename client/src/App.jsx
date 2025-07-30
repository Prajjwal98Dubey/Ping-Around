import "@fontsource/quicksand/700.css";
import "@fontsource/quicksand/400.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, use, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  AuthContext,
  LocationContext,
  UserContext,
} from "./context/all.context.js";

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
import { TURNOFF_USER_LOCATION } from "./apis/auth.api.js";
function App() {
  const { isLoading } = use(AuthContext);
  const { locationShared } = use(LocationContext);
  const { userDetails } = use(UserContext);
  useAuth();
  useEffect(() => {
    const handleBeforeUnLoad = async (e) => {
      e.preventDefault();
      if (locationShared) {
        navigator.sendBeacon(
          "http://localhost:5000/api/v1/event/user-detail",
          JSON.stringify({
            userDetails: {
              user_id: userDetails.user_id,
            },
            isJoined: false,
          })
        );
        navigator.sendBeacon(
          TURNOFF_USER_LOCATION,
          JSON.stringify({ userId: userDetails.user_id })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnLoad);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnLoad);
    };
  }, [locationShared, userDetails]);
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
