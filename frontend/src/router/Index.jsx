import { createBrowserRouter, redirect } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

import LayoutDashboard from "../components/Layout";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";

import ManagerHomePage from "../pages/manager/Home/Index";
import SignInPage from "../pages/sign-in/Index";
import SignUpPage from "../pages/sign-up/Index";
import SuccessCheckoutPage from "../pages/success-checkout/Index";

import ManageCoursePage from "../pages/manager/courses/Index";
import ManageCreateCoursePage from "../pages/manager/create-courses/Index";
import ManageCourseDetailPage from "../pages/manager/course-detail/Index";
import ManageContentCreatePage from "../pages/manager/course-content-create/Index";
import ManageCoursePreviewPage from "../pages/manager/course-preview/Index";

import ManageStudensPage from "../pages/manager/students/Index";
import ManageStudentCreatePage from "../pages/manager/students-create/Index";
import StudentCourseList from "../pages/manager/student-course/Index";
import StudentForm from "../pages/manager/student-course/studentForm";

import StudentPage from "../pages/student/student-overview/Index";

import {
  getCategories,
  getCourseDetail,
  getCourses,
  getDetailContent,
  getStudentsCourse,
} from "../services/courseService";
import { getDetailStudent, getStudents } from "../services/studentService";

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
        path: "courses",
        loader: async () => {
          try {
            return await getCourses();
          } catch {
            toast.error("Gagal memuat daftar course");
            return [];
          }
        },
        element: <ManageCoursePage />,
      },
      {
        path: "courses/create",
        loader: async () => {
          const categories = await getCategories();
          return { categories, course: null };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "courses/edit/:id",
        loader: async ({ params }) => {
          const categories = await getCategories();
          const course = await getCourseDetail(params.id);
          return { categories, course: course?.data };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "courses/:id",
        loader: async ({ params }) => {
          const course = await getCourseDetail(params.id);
          return course?.data;
        },
        element: <ManageCourseDetailPage />,
      },
      {
        path: "courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          const content = await getDetailContent(params.contentId);
          return content?.data;
        },
        element: <ManageContentCreatePage />,
      },
      {
        path: "courses/:id/preview",
        loader: async ({ params }) => {
          const course = await getCourseDetail(params.id, true);
          return course?.data;
        },
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "students",
        loader: async () => {
          const students = await getStudents();
          return students?.data;
        },
        element: <ManageStudensPage />,
      },
      {
        path: "students/create",
        element: <ManageStudentCreatePage />,
      },
      {
        path: "students/edit/:id",
        loader: async ({ params }) => {
          const student = await getDetailStudent(params.id);
          return student?.data;
        },
        element: <ManageStudentCreatePage />,
      },
      {
        path: "courses/students/:id",
        loader: async ({ params }) => {
          const course = await getStudentsCourse(params.id);
          return course?.data;
        },
        element: <StudentCourseList />,
      },
      {
        path: "courses/students/:id/add",
        loader: async () => {
          const students = await getStudents();
          return students?.data;
        },
        element: <StudentForm />,
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
        path: "detail-course/:id",
        element: <ManageCoursePreviewPage />,
      },
    ],
  },
]);

export default router;
