import { createBrowserRouter } from "react-router-dom";
import ManagerHomePage from "../pages/manager/Home/Index";
import SignInPage from "../pages/sign-in/Index";
import SignUpPage from "../pages/sign-up/Index";
import SuccessCheckoutPage from "../pages/success-checkout/Index";
import LayoutDashboard from "../components/Layout";
import ManageCoursePage from "../pages/manager/courses/Index";
import ManageCreateCoursePage from "../pages/manager/create-courses/Index";
import ManageCourseDetailPage from "../pages/manager/course-detail/Index";
import ManageContentCreatePage from "../pages/manager/course-content-create/Index";
import ManageCoursePreviewPage from "../pages/manager/course-preview/Index";

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
      },
      {
        path: "/manager/courses/create",
        element: <ManageCreateCoursePage />
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />
      },
      {
        path: "/manager/courses/:id/preview",
        element: <ManageCoursePreviewPage />
      }
    ]
  }
])

export default router