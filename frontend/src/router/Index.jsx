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
import StudentPage from "../pages/student/student-overview/Index";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";
import secureLocalStorage from "react-secure-storage";
import {
  getCategories,
  getCourseDetail,
  getCourses,
  getDetailContent,
} from "../services/courseService";
import { toast } from "react-toastify";
import ManageStudentCreatePage from "../pages/manager/students-create/Index";
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
        path: "/manager/courses",
        loader: async () => {
          try {
            return await getCourses();
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Gagal memuat daftar course"
            );
            return [];
          }
        },
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        loader: async () => {
          try {
            const categories = await getCategories();
            return { categories, course: null };
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Gagal memuat kategori"
            );
            throw redirect("/manager/courses");
          }
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/edit/:id",
        loader: async ({ params }) => {
          try {
            const categories = await getCategories();
            const course = await getCourseDetail(params.id);
            return { categories, course: course?.data };
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Gagal memuat course"
            );
            throw redirect("/manager/courses");
          }
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        loader: async ({ params }) => {
          try {
            const course = await getCourseDetail(params.id);
            return course?.data;
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Course tidak ditemukan"
            );
            throw redirect("/manager/courses");
          }
        },
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          try {
            const content = await getDetailContent(params.contentId);
            return content?.data;
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Content tidak ditemukan"
            );
            throw redirect(`/manager/courses/${params.id}`);
          }
        },
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        loader: async ({ params }) => {
          try {
            const course = await getCourseDetail(params.id, true);
            return course?.data;
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Gagal memuat preview course"
            );
            throw redirect("/manager/courses");
          }
        },
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "/manager/students",
        loader: async () => {
          const students = await getStudents()

          return students?.data;
        },
        element: <ManageStudensPage />,
      },
      {
        path: "/manager/students/create",
        element: <ManageStudentCreatePage />,
      },
      {
        path: '/manager/students/edit/:id',
        loader: async ({ params }) => {
          const student = await getDetailStudent(params.id)

          return student?.data
        },
        element: <ManageStudentCreatePage />
      }
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
