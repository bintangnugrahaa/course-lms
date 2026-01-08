import { createBrowserRouter, redirect } from "react-router-dom";
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
import ManageStudensPage from "../pages/manager/students/Index";
import { element } from "prop-types";
import StudentPage from "../pages/student/student-overview/Index";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";
import secureLocalStorage from "react-secure-storage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHomePage />,
  },
  {
    path: "/manager/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/manager/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/success-checkout",
    element: <SuccessCheckoutPage />,
  },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async () => {
      const session = secureLocalStorage.getItem(STORAGE_KEY);

      if (!session || session.role !== "manager") {
        throw redirect("/manager/sign-in");
      }

      return session;
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "/manager/students",
        element: <ManageStudensPage />,
      },
    ],
  },
  {
    path: "/student",
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />,
      },
      {
        path: "/student/detail-course/:id",
        element: <ManageCoursePreviewPage />,
      },
    ],
  },
]);

export default router;
