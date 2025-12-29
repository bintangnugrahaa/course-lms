import { createBrowserRouter } from "react-router-dom";
import ManagerHome from "../pages/ManagerHome/Index";
import SignInPage from "../pages/SignIn/Index";
import SignUpPage from "../pages/SignUp/Index";
import SuccessCheckoutPage from "../pages/SuccessCheckout/Index";

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
  },
  {
    path: "/success-checkout",
    element: <SuccessCheckoutPage />
  }
])

export default router