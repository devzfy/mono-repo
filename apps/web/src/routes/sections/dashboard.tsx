import { type RouteObject } from "react-router";
import DashboardLayout from "../../layout/MainLayout";
import { SuspenseOutlet } from "./Suspense";
import { lazy } from "react";


const TanstackPage = lazy(() => import('../../module/ui/Tanstack'))
const MUIPage = lazy(() => import('../../module/ui/MUI'))

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: dashboardLayout(),
    children: [
      {
        index: true,
        element: <TanstackPage />
      },
      {
        path: "mui",
        element: <MUIPage />
      }
    ]
  }
]