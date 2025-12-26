import { createBrowserRouter } from "react-router-dom";
import ManagerHome from "../pages/ManagerHome/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHome />
  }
])

export default router