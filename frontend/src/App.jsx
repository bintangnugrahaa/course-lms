import { creteBrowserRouter, RouterProvider } from "react-router-dom";

const router = creteBrowserRouter([
  {
    Path: "/",
    element: <div>Hellow World</div>,
  },
]);

function App() {
  <RouterProvider router={router} />;
}

export default App;
