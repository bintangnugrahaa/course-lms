import { createBrowserRouter } from "react-router-dom";
import ManagerHome from "../pages/ManagerHome/Index";
import SignInPage from "../pages/SignIn/Index";
import SignUpPage from "../pages/SignUp/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHome />
  },
  {
    path: "/manager/sign-in",
    element: <SignInPage />
  },
  {
    path: "/manager/sign-up",
    element: <SignUpPage />
  }
])

export default router