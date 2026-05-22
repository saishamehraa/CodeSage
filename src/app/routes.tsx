//src/app/routes.tsx
import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Scanner } from "./components/Scanner";
import { Repository } from "./components/Repository";
import { Analysis } from "./components/Analysis";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "scanner", Component: Scanner },
      { path: "repository/:id", Component: Repository },
      { path: "analysis/:id", Component: Analysis },
      { path: "settings", Component: Settings },
    ],
  },
]);
