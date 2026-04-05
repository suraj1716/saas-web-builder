import { createBrowserRouter } from "react-router-dom";
import BuilderIndex from "./domains/builder/pages/BuilderIndex";
import BuilderEdit from "./domains/builder/pages/BuilderEdit";
import BuilderErrorBoundary from "./shared/utils/BuilderErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/", // <-- root route added
    element: <BuilderIndex />, // or a HomePage component
    errorElement: <BuilderErrorBoundary />,
  },
  {
    path: "/builder",
    element: <BuilderIndex />,
    errorElement: <BuilderErrorBoundary />,
  },
  {
    path: "/builder/:id",
    element: <BuilderEdit />,
    errorElement: <BuilderErrorBoundary />,
  },
]);