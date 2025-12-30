import { createBrowserRouter } from "react-router-dom";
import ManagerHomePage from "../pages/manager/Home/Index";
import SignInPage from "../pages/SignIn/Index";
import SignUpPage from "../pages/SignUp/Index";
import SuccessCheckoutPage from "../pages/SuccessCheckout/Index";
import LayoutDashboard from "../components/Layout";
import ManageCoursePage from "../pages/manager/courses/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHomePage />
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
  },
  {
    path: "/manager",
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />
      },
      {
        path: "/manager/courses",
        element: <ManageCoursePage />
      }
    ]
  }
])

export default router