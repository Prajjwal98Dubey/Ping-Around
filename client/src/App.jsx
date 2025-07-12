import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import HomeContainer from "./pages/HomeContainer";
import Connect from "./pages/Connect";
import SignUp from "./pages/SignUp";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";

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
        path: "connect",
        element: <Connect />,
      },
      {
        path: "me",
        element: <MyProfile />,
      },
      {
        path: "/edit-profile",
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
]);
