import { Suspense } from "react";
import { usePathname } from "../hooks/use-pathname";
import { Outlet } from "react-router";

import Loading from '../../pages/LoadingPage'

export function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<Loading />} >
      <Outlet />
    </Suspense>
  );
}